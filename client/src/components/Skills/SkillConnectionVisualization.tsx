import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, UnlockedSkill } from "@/data/skillDefinitions";
import { skillUnlockSystem } from "@/lib/skillUnlockSystem";
import { ArrowLeft, Filter, Info, Zap, Users, TrendingUp } from "lucide-react";
import { Icon, getCategoryIcon } from '@/lib/iconUtils';

interface SkillNode {
  id: string;
  skill: any;
  x: number;
  y: number;
  isUnlocked: boolean;
  category: string;
  level: number;
}

interface SkillConnection {
  from: string;
  to: string;
  type: 'prerequisite' | 'category' | 'level';
  strength: number;
}

interface SkillConnectionVisualizationProps {
  onSkillClick?: (skill: UnlockedSkill) => void;
  onBackToTree?: () => void;
}

export function SkillConnectionVisualization({ onSkillClick, onBackToTree }: SkillConnectionVisualizationProps) {
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [connections, setConnections] = useState<SkillConnection[]>([]);
  const [unlockedSkills, setUnlockedSkills] = useState<UnlockedSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'category' | 'level'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Physical');

  useEffect(() => {
    initializeVisualization();
  }, []);

  const initializeVisualization = async () => {
    const unlocked = await skillUnlockSystem.getAllUnlockedSkills();
    setUnlockedSkills(unlocked);
    
    const nodes = createSkillNodes(unlocked);
    const connections = calculateConnections(nodes);
    
    setSkillNodes(nodes);
    setConnections(connections);
  };

  const createSkillNodes = useCallback((unlocked: UnlockedSkill[]): SkillNode[] => {
    const unlockedIds = new Set(unlocked.map(s => s.id));
    const nodes: SkillNode[] = [];
    
    // Create a much better organized layout with no overlaps
    const categories = Object.keys(SKILL_CATEGORIES);
    const nodeRadius = 30; // Increased radius
    const minSpacing = 100; // Increased minimum spacing
    
    // Group skills by category first
    const skillsByCategory: Record<string, any[]> = {};
    categories.forEach(category => {
      skillsByCategory[category] = SKILL_DEFINITIONS.filter(skill => skill.category === category);
    });
    
    // Use a larger canvas and better spacing
    const canvasWidth = 600;
    const canvasHeight = 800;
    const categoriesPerRow = 2;
    const categorySpacingX = 280;
    const categorySpacingY = 180;
    
    let currentCategoryIndex = 0;
    
    categories.forEach((category) => {
      const categorySkills = skillsByCategory[category];
      if (categorySkills.length === 0) return;
      
      // Calculate category center position with more space
      const categoryRow = Math.floor(currentCategoryIndex / categoriesPerRow);
      const categoryCol = currentCategoryIndex % categoriesPerRow;
      const categoryCenterX = 140 + categoryCol * categorySpacingX;
      const categoryCenterY = 120 + categoryRow * categorySpacingY;
      
      // Arrange skills in this category with much more spacing
      const skillsPerRow = Math.max(2, Math.ceil(Math.sqrt(categorySkills.length)));
      const skillSpacing = Math.max(minSpacing, nodeRadius * 3);
      
      categorySkills.forEach((skill, skillIndex) => {
        const skillRow = Math.floor(skillIndex / skillsPerRow);
        const skillCol = skillIndex % skillsPerRow;
      
        // Center the skills within the category with proper spacing
        const offsetX = (skillCol - (skillsPerRow - 1) / 2) * skillSpacing;
        const offsetY = (skillRow - (Math.ceil(categorySkills.length / skillsPerRow) - 1) / 2) * skillSpacing;
      
        const x = categoryCenterX + offsetX;
        const y = categoryCenterY + offsetY;
        
        // Ensure nodes stay within bounds
        const boundedX = Math.max(nodeRadius + 20, Math.min(canvasWidth - nodeRadius - 20, x));
        const boundedY = Math.max(nodeRadius + 20, Math.min(canvasHeight - nodeRadius - 20, y));

        nodes.push({
        id: skill.id,
        skill,
          x: boundedX,
          y: boundedY,
        isUnlocked: unlockedIds.has(skill.id),
          category: skill.category,
          level: skill.level
        });
      });
      
      currentCategoryIndex++;
    });
    
    // Enhanced overlap resolution with multiple passes
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );
          
          // If nodes are too close, push them apart more aggressively
          if (distance < minSpacing) {
            const angle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
            const pushDistance = (minSpacing - distance) / 2 + 10; // Extra push
            
            nodeA.x -= Math.cos(angle) * pushDistance;
            nodeA.y -= Math.sin(angle) * pushDistance;
            nodeB.x += Math.cos(angle) * pushDistance;
            nodeB.y += Math.sin(angle) * pushDistance;
            
            // Keep within bounds with padding
            nodeA.x = Math.max(nodeRadius + 20, Math.min(canvasWidth - nodeRadius - 20, nodeA.x));
            nodeA.y = Math.max(nodeRadius + 20, Math.min(canvasHeight - nodeRadius - 20, nodeA.y));
            nodeB.x = Math.max(nodeRadius + 20, Math.min(canvasWidth - nodeRadius - 20, nodeB.x));
            nodeB.y = Math.max(nodeRadius + 20, Math.min(canvasHeight - nodeRadius - 20, nodeB.y));
          }
        }
      }
    }
    
    return nodes;
  }, []);

  const calculateConnections = useCallback((nodes: SkillNode[]): SkillConnection[] => {
    const connections: SkillConnection[] = [];
    
    nodes.forEach(nodeA => {
      nodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        
        // Category connections (same category, adjacent levels) - stronger connections
        if (nodeA.category === nodeB.category && Math.abs(nodeA.level - nodeB.level) === 1) {
          connections.push({
            from: nodeA.level < nodeB.level ? nodeA.id : nodeB.id,
            to: nodeA.level < nodeB.level ? nodeB.id : nodeA.id,
            type: 'category',
            strength: 0.9
          });
        }
        
        // Prerequisite connections (direct skill dependencies within same category)
        if (nodeA.category === nodeB.category && nodeB.level === nodeA.level + 1) {
          connections.push({
            from: nodeA.id,
            to: nodeB.id,
            type: 'prerequisite',
            strength: 1.0
          });
        }
      });
    });
    
    return connections;
  }, []);

  const getFilteredNodes = (): SkillNode[] => {
    let filtered = skillNodes;
    
    if (filterType === 'category') {
      filtered = filtered.filter(node => node.category === selectedCategory);
    } else if (filterType === 'level') {
      filtered = filtered.filter(node => node.level <= 3); // Show only first 3 levels
    }
    
    return filtered;
  };

  const getFilteredConnections = (): SkillConnection[] => {
    const visibleNodeIds = new Set(getFilteredNodes().map(node => node.id));
    return connections.filter(conn => 
      visibleNodeIds.has(conn.from) && visibleNodeIds.has(conn.to)
    );
  };

  const handleSkillClick = (node: SkillNode) => {
      setSelectedSkill(selectedSkill === node.id ? null : node.id);
    
    if (node.isUnlocked && onSkillClick) {
      const unlockedSkill = unlockedSkills.find(s => s.id === node.id);
      if (unlockedSkill) {
        onSkillClick(unlockedSkill);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Physical': '#10B981',
      'Mental': '#3B82F6',
      'Recovery': '#8B5CF6',
      'Nutrition': '#F59E0B'
    };
    return colors[category] || '#6B7280';
  };

  const getConnectionColor = (type: SkillConnection['type']) => {
    const colors = {
      'prerequisite': '#10B981',
      'category': '#3B82F6',
      'level': '#8B5CF6'
    };
    return colors[type];
  };

  const filteredNodes = getFilteredNodes();
  const filteredConnections = getFilteredConnections();
  const selectedNode = selectedSkill ? skillNodes.find(n => n.id === selectedSkill) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={onBackToTree}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Skill Connections
            </h1>
            <p className="text-gray-600">
              Explore how skills relate to each other
            </p>
        </div>
        </motion.div>

        {/* Filter Controls */}
        <div className="flex gap-2 mb-3">
          {[
            { id: 'all', label: 'All Skills', icon: Zap },
            { id: 'category', label: 'By Category', icon: Users }
          ].map((filter) => {
            const Icon = filter.icon;
            const isActive = filterType === filter.id;
            
            return (
        <button
                key={filter.id}
                onClick={() => setFilterType(filter.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
                <Icon className="w-4 h-4" />
                {filter.label}
        </button>
            );
          })}
        </div>

        {/* Mobile-friendly Category Selector */}
        {filterType === 'category' && (
          <motion.div 
            className="mb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
        >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(SKILL_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      <div className="px-4 py-4">
        {/* Connection Statistics */}
        <motion.div 
          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{filteredNodes.length}</div>
              <div className="text-xs text-gray-500">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{filteredConnections.length}</div>
              <div className="text-xs text-gray-500">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {filteredNodes.filter(n => n.isUnlocked).length}
              </div>
              <div className="text-xs text-gray-500">Unlocked</div>
            </div>
        </div>
        </motion.div>

        {/* Visualization Area */}
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="relative w-full h-96 bg-gray-50">
            <svg 
          width="100%"
              height="100%" 
              viewBox="0 0 600 800"
              className="absolute inset-0"
              preserveAspectRatio="xMidYMid meet"
        >
              {/* Connection Lines - Only show connections between visible nodes */}
              {filteredConnections.map((connection, index) => {
                const fromNode = filteredNodes.find(n => n.id === connection.from);
                const toNode = filteredNodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <motion.line
                key={`${connection.from}-${connection.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                    stroke={getConnectionColor(connection.type)}
                    strokeWidth={2}
                    strokeOpacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
              />
            );
          })}

              {/* Skill Nodes - Only show filtered nodes */}
              {filteredNodes.map((node, index) => {
                const category = SKILL_CATEGORIES[node.category as keyof typeof SKILL_CATEGORIES];
            const isSelected = selectedSkill === node.id;

            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                      r={isSelected ? 30 : 25}
                      fill={node.isUnlocked ? "white" : "#f3f4f6"}
                      stroke={node.isUnlocked ? getCategoryColor(node.category) : "#d1d5db"}
                      strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer"
                  onClick={() => handleSkillClick(node)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                />
                    <motion.foreignObject
                      x={node.x - 12}
                      y={node.y - 8}
                      width="24"
                      height="16"
                      className="pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 + 0.2, duration: 0.3 }}
                    >
                      <div className="flex justify-center">
                        <Icon 
                          name={getCategoryIcon(node.category)} 
                          size={16} 
                          color={node.isUnlocked ? getCategoryColor(node.category) : "#9ca3af"}
                        />
                      </div>
                    </motion.foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
        </motion.div>

        {/* Selected Skill Details */}
        <AnimatePresence>
          {selectedNode && (
        <motion.div
              className="mt-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Icon 
                    name={getCategoryIcon(selectedNode.category)} 
                    size={24} 
                    color={getCategoryColor(selectedNode.category)}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedNode.skill.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {selectedNode.skill.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Level {selectedNode.level}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {selectedNode.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      selectedNode.isUnlocked 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedNode.isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              </div>
        </motion.div>
      )}
        </AnimatePresence>

        {/* Connection Legend */}
        <motion.div 
          className="mt-4 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Connection Types
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Prerequisites</span>
          </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Category</span>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}