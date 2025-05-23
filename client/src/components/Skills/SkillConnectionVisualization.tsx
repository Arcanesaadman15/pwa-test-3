import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, UnlockedSkill } from "@/data/skillDefinitions";
import { skillUnlockSystem } from "@/lib/skillUnlockSystem";

interface SkillNode {
  id: string;
  skill: any;
  x: number;
  y: number;
  isUnlocked: boolean;
  connections: string[];
}

interface SkillConnection {
  from: string;
  to: string;
  strength: number; // 0-1, based on shared requirements
  type: 'prerequisite' | 'shared_tasks' | 'category_progression';
}

interface SkillConnectionVisualizationProps {
  onSkillClick?: (skill: UnlockedSkill) => void;
}

export function SkillConnectionVisualization({ onSkillClick }: SkillConnectionVisualizationProps) {
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [connections, setConnections] = useState<SkillConnection[]>([]);
  const [unlockedSkills, setUnlockedSkills] = useState<UnlockedSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'unlocked' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Physical');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    initializeVisualization();
  }, []);

  useEffect(() => {
    updateVisualization();
  }, [viewMode, selectedCategory]);

  const initializeVisualization = async () => {
    const unlocked = await skillUnlockSystem.getAllUnlockedSkills();
    setUnlockedSkills(unlocked);
    
    const nodes = createSkillNodes(unlocked);
    const connections = calculateConnections(nodes);
    
    setSkillNodes(nodes);
    setConnections(connections);
  };

  const createSkillNodes = (unlocked: UnlockedSkill[]): SkillNode[] => {
    const unlockedIds = new Set(unlocked.map(s => s.id));
    const containerWidth = 400;
    const containerHeight = 400;
    
    return SKILL_DEFINITIONS.map((skill, index) => {
      // Position nodes in a circular layout by category, then by level
      const categoryIndex = Object.keys(SKILL_CATEGORIES).indexOf(skill.category);
      const categoryAngle = (categoryIndex / Object.keys(SKILL_CATEGORIES).length) * 2 * Math.PI;
      
      // Position by level within category (inner to outer)
      const levelRadius = 60 + (skill.level - 1) * 40;
      const skillsInCategory = SKILL_DEFINITIONS.filter(s => s.category === skill.category);
      const skillIndexInCategory = skillsInCategory.findIndex(s => s.id === skill.id);
      const angleOffset = (skillIndexInCategory / skillsInCategory.length) * 0.8 - 0.4;
      
      const x = containerWidth / 2 + Math.cos(categoryAngle + angleOffset) * levelRadius;
      const y = containerHeight / 2 + Math.sin(categoryAngle + angleOffset) * levelRadius;

      return {
        id: skill.id,
        skill,
        x: Math.max(30, Math.min(containerWidth - 30, x)),
        y: Math.max(30, Math.min(containerHeight - 30, y)),
        isUnlocked: unlockedIds.has(skill.id),
        connections: []
      };
    });
  };

  const calculateConnections = (nodes: SkillNode[]): SkillConnection[] => {
    const connections: SkillConnection[] = [];
    
    nodes.forEach(nodeA => {
      nodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        
        const connection = analyzeSkillConnection(nodeA.skill, nodeB.skill);
        if (connection.strength > 0.3) {
          connections.push({
            from: nodeA.id,
            to: nodeB.id,
            strength: connection.strength,
            type: connection.type
          });
        }
      });
    });
    
    return connections;
  };

  const analyzeSkillConnection = (skillA: any, skillB: any): { strength: number; type: 'prerequisite' | 'shared_tasks' | 'category_progression' } => {
    // Same category progression
    if (skillA.category === skillB.category) {
      if (Math.abs(skillA.level - skillB.level) === 1) {
        return { strength: 0.8, type: 'category_progression' };
      }
    }

    // Shared task requirements
    const tasksA = new Set(skillA.requirements.map((r: any) => r.taskId));
    const tasksB = new Set(skillB.requirements.map((r: any) => r.taskId));
    const sharedTasks = Array.from(tasksA).filter(task => tasksB.has(task));
    
    if (sharedTasks.length > 0) {
      const sharedRatio = sharedTasks.length / Math.max(tasksA.size, tasksB.size);
      return { strength: sharedRatio * 0.9, type: 'shared_tasks' };
    }

    // Prerequisite relationship (lower level skills that share tasks)
    if (skillA.level < skillB.level && sharedTasks.length > 0) {
      return { strength: 0.6, type: 'prerequisite' };
    }

    return { strength: 0, type: 'shared_tasks' };
  };

  const updateVisualization = () => {
    // Filter nodes and connections based on view mode
    // This would update the display without recreating everything
  };

  const getVisibleNodes = (): SkillNode[] => {
    switch (viewMode) {
      case 'unlocked':
        return skillNodes.filter(node => node.isUnlocked);
      case 'category':
        return skillNodes.filter(node => node.skill.category === selectedCategory);
      default:
        return skillNodes;
    }
  };

  const getVisibleConnections = (): SkillConnection[] => {
    const visibleNodeIds = new Set(getVisibleNodes().map(n => n.id));
    return connections.filter(conn => 
      visibleNodeIds.has(conn.from) && visibleNodeIds.has(conn.to)
    );
  };

  const handleSkillClick = (node: SkillNode) => {
    if (node.isUnlocked) {
      setSelectedSkill(selectedSkill === node.id ? null : node.id);
      const unlockedSkill = unlockedSkills.find(s => s.id === node.id);
      if (unlockedSkill && onSkillClick) {
        onSkillClick(unlockedSkill);
      }
    }
  };

  const getConnectionColor = (connection: SkillConnection): string => {
    switch (connection.type) {
      case 'prerequisite': return '#10B981'; // Green
      case 'shared_tasks': return '#3B82F6'; // Blue  
      case 'category_progression': return '#8B5CF6'; // Purple
      default: return '#6B7280'; // Gray
    }
  };

  const visibleNodes = getVisibleNodes();
  const visibleConnections = getVisibleConnections();

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Skill Connections</h2>
        <p className="text-gray-400 text-sm">Discover how skills interlink and build upon each other</p>
      </div>

      {/* View Mode Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setViewMode('all')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          All Skills
        </button>
        <button
          onClick={() => setViewMode('unlocked')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'unlocked' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          My Skills
        </button>
        <button
          onClick={() => setViewMode('category')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'category' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          By Category
        </button>
      </div>

      {/* Category Selector (when in category mode) */}
      {viewMode === 'category' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(SKILL_CATEGORIES).map(([category, data]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {data.icon} {category}
            </button>
          ))}
        </div>
      )}

      {/* Visualization Container */}
      <div className="bg-gray-900 rounded-xl p-4 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          viewBox="0 0 400 400"
          className="w-full h-96"
        >
          {/* Connection Lines */}
          {visibleConnections.map((connection, index) => {
            const fromNode = visibleNodes.find(n => n.id === connection.from);
            const toNode = visibleNodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            const isHighlighted = selectedSkill === connection.from || selectedSkill === connection.to;
            
            return (
              <motion.line
                key={`${connection.from}-${connection.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getConnectionColor(connection)}
                strokeWidth={isHighlighted ? 3 : 1}
                strokeOpacity={isHighlighted ? 0.8 : connection.strength * 0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            );
          })}

          {/* Skill Nodes */}
          {visibleNodes.map((node, index) => {
            const category = SKILL_CATEGORIES[node.skill.category as keyof typeof SKILL_CATEGORIES];
            const isSelected = selectedSkill === node.id;
            const isConnectedToSelected = selectedSkill && 
              visibleConnections.some(c => 
                (c.from === selectedSkill && c.to === node.id) ||
                (c.to === selectedSkill && c.from === node.id)
              );

            return (
              <g key={node.id}>
                {/* Node Circle */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 20 : 16}
                  fill={node.isUnlocked ? category.color : '#374151'}
                  stroke={isSelected ? '#FBBF24' : isConnectedToSelected ? '#10B981' : '#6B7280'}
                  strokeWidth={isSelected ? 3 : isConnectedToSelected ? 2 : 1}
                  opacity={node.isUnlocked ? 1 : 0.6}
                  className="cursor-pointer"
                  onClick={() => handleSkillClick(node)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
                
                {/* Node Icon */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  className="pointer-events-none select-none"
                >
                  {node.isUnlocked ? category.icon : '🔒'}
                </text>
                
                {/* Level Badge */}
                {node.isUnlocked && (
                  <motion.circle
                    cx={node.x + 12}
                    cy={node.y - 12}
                    r={8}
                    fill={category.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  />
                )}
                {node.isUnlocked && (
                  <text
                    x={node.x + 12}
                    y={node.y - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill="white"
                    className="pointer-events-none select-none font-bold"
                  >
                    {node.skill.level}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Skill Info */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-4"
        >
          {(() => {
            const skill = visibleNodes.find(n => n.id === selectedSkill)?.skill;
            if (!skill) return null;
            
            const connectedSkills = visibleConnections
              .filter(c => c.from === selectedSkill || c.to === selectedSkill)
              .map(c => c.from === selectedSkill ? c.to : c.from);

            return (
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{skill.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{skill.description}</p>
                
                {connectedSkills.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Connected Skills ({connectedSkills.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {connectedSkills.slice(0, 5).map(connectedId => {
                        const connectedSkill = SKILL_DEFINITIONS.find(s => s.id === connectedId);
                        if (!connectedSkill) return null;
                        
                        return (
                          <span
                            key={connectedId}
                            className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                          >
                            {connectedSkill.title}
                          </span>
                        );
                      })}
                      {connectedSkills.length > 5 && (
                        <span className="text-xs text-gray-400">+{connectedSkills.length - 5} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Legend */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h4 className="text-white font-semibold mb-3 text-center">Connection Types</h4>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="w-8 h-1 bg-purple-500 mx-auto mb-1"></div>
            <span className="text-gray-300">Progression</span>
          </div>
          <div className="text-center">
            <div className="w-8 h-1 bg-blue-500 mx-auto mb-1"></div>
            <span className="text-gray-300">Shared Tasks</span>
          </div>
          <div className="text-center">
            <div className="w-8 h-1 bg-green-500 mx-auto mb-1"></div>
            <span className="text-gray-300">Prerequisites</span>
          </div>
        </div>
      </div>
    </div>
  );
}