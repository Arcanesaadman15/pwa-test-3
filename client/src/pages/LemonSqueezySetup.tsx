import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, AlertTriangle, Settings } from "lucide-react";

export default function LemonSqueezySetup() {
  const [copied, setCopied] = useState<string>('');
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const currentConfig = {
    storeId: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID,
    apiKey: import.meta.env.VITE_LEMONSQUEEZY_API_KEY,
    appUrl: import.meta.env.VITE_APP_URL,
  };

  const isConfigured = currentConfig.storeId && currentConfig.apiKey && 
    currentConfig.storeId !== '12345' && 
    !currentConfig.apiKey.includes('placeholder');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LemonSqueezy Setup</h1>
          <p className="text-gray-400">Configure your payment system for PeakForge subscriptions</p>
        </motion.div>

        {/* Configuration Status */}
        <motion.div
          className={`mb-8 p-6 rounded-2xl border ${
            isConfigured 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            {isConfigured ? (
              <Check className="w-6 h-6 text-green-400 mr-3" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
            )}
            <h2 className={`text-xl font-bold ${isConfigured ? 'text-green-400' : 'text-red-400'}`}>
              {isConfigured ? 'Configuration Complete' : 'Configuration Required'}
            </h2>
          </div>
          <p className={`${isConfigured ? 'text-green-300' : 'text-red-300'}/80`}>
            {isConfigured 
              ? 'Your LemonSqueezy integration is configured and ready to use!'
              : 'You need to set up your LemonSqueezy account and configure the environment variables.'}
          </p>
        </motion.div>

        {/* Current Configuration */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Current Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Store ID</label>
              <div className="flex items-center">
                <code className="flex-1 bg-gray-900/50 text-gray-300 p-3 rounded-lg font-mono text-sm">
                  {currentConfig.storeId || 'Not set'}
                </code>
                {currentConfig.storeId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentConfig.storeId, 'storeId')}
                    className="ml-2"
                  >
                    {copied === 'storeId' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
              <div className="flex items-center">
                <code className="flex-1 bg-gray-900/50 text-gray-300 p-3 rounded-lg font-mono text-sm">
                  {currentConfig.apiKey ? `${currentConfig.apiKey.substring(0, 20)}...` : 'Not set'}
                </code>
                {currentConfig.apiKey && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentConfig.apiKey, 'apiKey')}
                    className="ml-2"
                  >
                    {copied === 'apiKey' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">App URL</label>
              <div className="flex items-center">
                <code className="flex-1 bg-gray-900/50 text-gray-300 p-3 rounded-lg font-mono text-sm">
                  {currentConfig.appUrl || 'Not set'}
                </code>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Setup Steps */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Setup Instructions</h3>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Create LemonSqueezy Account</h4>
                <p className="text-gray-400 mb-3">
                  Sign up at LemonSqueezy and create your store. Your account starts in test mode.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://lemonsqueezy.com', '_blank')}
                  className="border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to LemonSqueezy
                </Button>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Get API Keys</h4>
                <p className="text-gray-400 mb-3">
                  Go to Settings → API and create an API key. Also note your Store ID.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://app.lemonsqueezy.com/settings/api', '_blank')}
                  className="border-blue-500/50 hover:border-blue-500 hover:bg-blue-500/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  LemonSqueezy API Settings
                </Button>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Create Products</h4>
                <p className="text-gray-400 mb-3">
                  Create your subscription products and note the variant IDs for each plan.
                </p>
                <div className="bg-gray-900/50 p-4 rounded-lg font-mono text-sm text-gray-300">
                  <div>Basic Plan: $12.99/month</div>
                  <div>Pro Plan: $24.99/month</div>
                  <div>Lifetime: $99.99 one-time</div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Update Environment Variables</h4>
                <p className="text-gray-400 mb-3">
                  Update both client/.env.local and server/.env with your LemonSqueezy credentials.
                </p>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="text-gray-300 text-sm font-mono">
                    <div>VITE_LEMONSQUEEZY_STORE_ID=your_store_id</div>
                    <div>VITE_LEMONSQUEEZY_API_KEY=your_api_key</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Actions */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Test Your Setup</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Test Pricing Page
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('/LEMONSQUEEZY_SETUP.md', '_blank')}
              className="border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Full Setup Guide
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 