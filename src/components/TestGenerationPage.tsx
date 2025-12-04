import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Sparkles,
  Search,
  Upload,
  FileText,
  Code2,
  FileJson,
  User,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react';
import { Project, Feature, TestRequirement, AuthUser } from '../types/models';
import { generateTestRequirements } from '../utils/aiSimulator';
import { toast } from 'sonner@2.0.3';

interface TestGenerationPageProps {
  project: Project;
  feature: Feature | null;
  currentUser: AuthUser;
  onBack: () => void;
  onRequirementsGenerated: (requirements: TestRequirement[], feature: Feature) => void;
  onSelectFeature?: (feature: Feature) => void;
}

const suggestedPrompts = [
  {
    title: 'Login Flow',
    template: `API Name: User Login
Endpoint: POST /api/v1/auth/login
Request Fields:
- email (string, required)
- password (string, required)
- deviceId (string, required)
Expected Status Codes: 200 (Success), 401 (Invalid credentials), 429 (Rate limit)
Business Rules:
- Max 5 concurrent devices
- Account locked after 5 failed attempts
- Session expires after 24 hours`,
  },
  {
    title: 'Signup Flow',
    template: `API Name: User Registration
Endpoint: POST /api/v1/auth/register
Request Fields:
- email (string, required)
- password (string, required, min 8 chars)
- firstName (string, required)
- lastName (string, required)
Payload: JSON with user details
Expected Status Codes: 201 (Created), 400 (Invalid data), 409 (Email exists)
Business Rules:
- Email must be unique
- Password must meet complexity requirements
- Email verification required`,
  },
  {
    title: 'Add to Cart Flow',
    template: `API Name: Add Item to Cart
Endpoint: POST /api/v1/cart/items
Request Fields:
- productId (string, required)
- quantity (number, required)
- userId (string, required)
Expected Status Codes: 200 (Success), 400 (Invalid quantity), 404 (Product not found)
Business Rules:
- Quantity must be positive
- Check inventory availability
- Apply discount rules if applicable`,
  },
];

export function TestGenerationPage({
  project,
  feature,
  currentUser,
  onBack,
  onRequirementsGenerated,
  onSelectFeature,
}: TestGenerationPageProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [featureDescription, setFeatureDescription] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const recentFeatures = project.features.slice(0, 5);

  const handleSuggestedPrompt = (template: string) => {
    setFeatureDescription(template);
  };

  const handleCreateTestScript = async () => {
    if (!featureName.trim() || !featureDescription.trim()) {
      toast.error('Please provide both feature name and description');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(1);

    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate test requirements
      const requirements = await generateTestRequirements(featureDescription);

      // Create or update feature
      const newFeature: Feature = feature || {
        id: `feat-${Date.now()}`,
        projectId: project.id,
        name: featureName,
        description: featureDescription,
        apiSpecs: [],
        status: 'in-progress',
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentStep(0);
      toast.success(`Generated ${requirements.length} test requirements!`);
      onRequirementsGenerated(requirements, newFeature);
    } catch (error) {
      setIsGenerating(false);
      setCurrentStep(0);
      toast.error('Failed to generate test requirements');
    }
  };

  const credits = 1250;
  const maxCredits = 2000;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div
        className={`bg-white border-r border-cyan-200 transition-all duration-300 ${
          sidebarExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Project Header */}
          <div className="p-4 border-b border-cyan-200">
            {sidebarExpanded ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-cyan-900 truncate">{project.name}</h3>
                  <button
                    onClick={() => setSidebarExpanded(false)}
                    className="text-gray-400 hover:text-cyan-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>
            ) : (
              <button
                onClick={() => setSidebarExpanded(true)}
                className="w-full flex justify-center text-gray-400 hover:text-cyan-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {sidebarExpanded && (
            <>
              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-cyan-200 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Recent Features */}
              <div className="flex-1 px-4 overflow-hidden">
                <p className="text-sm text-gray-500 mb-3">Recent features</p>
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {recentFeatures.length > 0 ? (
                    <div className="space-y-2">
                      {recentFeatures.map((feat) => (
                        <button
                          key={feat.id}
                          onClick={() => onSelectFeature?.(feat)}
                          className="w-full p-3 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-pointer transition-colors text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{feat.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(feat.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                feat.status === 'completed'
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : feat.status === 'in-progress'
                                  ? 'bg-cyan-100 text-cyan-700 border-cyan-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }
                            >
                              {feat.status}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No features yet</p>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Footer - Account & Credits */}
              <div className="p-4 border-t border-cyan-200 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Credits</span>
                    <span className="text-sm text-cyan-600">
                      {credits} / {maxCredits}
                    </span>
                  </div>
                  <Progress value={(credits / maxCredits) * 100} className="h-2" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.role}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-cyan-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-cyan-900">Create New Feature</h2>
              <p className="text-sm text-gray-600">Generate AI-powered test requirements</p>
            </div>
            <Button variant="outline" onClick={onBack} className="border-cyan-300">
              ← Back to Project
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-8 space-y-6">
            {/* Feature Name Input */}
            <div>
              <label className="text-gray-700 mb-2 block">Feature Name</label>
              <Input
                placeholder="e.g., User Login, Payment Processing, Video Streaming..."
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                className="border-cyan-200 focus:border-cyan-500"
              />
            </div>

            {/* Main Input Area */}
            <Card className="border-cyan-200 shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-cyan-900">Describe Your Feature</h3>
                </div>
                <Textarea
                  placeholder="Provide detailed information about your API:
• API Name & Endpoint
• HTTP Method (GET, POST, PUT, DELETE)
• Request Fields & Data Types
• Payload Structure (if applicable)
• Expected Status Codes
• Business Rules & Validations
• Any specific edge cases to test"
                  value={featureDescription}
                  onChange={(e) => setFeatureDescription(e.target.value)}
                  className="min-h-[300px] border-cyan-200 focus:border-cyan-500 resize-none"
                />
                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" className="border-cyan-300 text-cyan-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images/Files
                  </Button>
                  <Button
                    onClick={handleCreateTestScript}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Test Script
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Suggested Prompts */}
            <div>
              <h4 className="text-gray-700 mb-3">Suggested Prompts</h4>
              <div className="grid grid-cols-3 gap-4">
                {suggestedPrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    className="p-4 border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleSuggestedPrompt(prompt.template)}
                  >
                    <h5 className="text-cyan-900 mb-2">{prompt.title}</h5>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {prompt.template.split('\n')[0]}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <Card className="bg-cyan-50 border-cyan-200">
              <div className="p-6">
                <h4 className="text-cyan-900 mb-3">💡 Tips for Better Results</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-1">•</span>
                    <span>Be specific about API endpoints, methods, and expected behaviors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-1">•</span>
                    <span>Include all required fields and their data types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-1">•</span>
                    <span>List all possible status codes and their scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-1">•</span>
                    <span>Mention business rules and edge cases to ensure comprehensive testing</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Progress Tracker */}
      <div className="w-64 bg-white border-l border-cyan-200 p-6">
        <h3 className="text-cyan-900 mb-6">Generation Progress</h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                currentStep === 1
                  ? 'bg-cyan-600 text-white'
                  : currentStep > 1
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}
            >
              {currentStep === 1 ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentStep > 1 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className={currentStep >= 1 ? 'text-cyan-900' : 'text-gray-500'}>
                Generating Test Requirements
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentStep === 1 ? 'In Progress...' : currentStep > 1 ? 'Completed' : 'Pending'}
              </p>
            </div>
          </div>

          <Separator className="bg-cyan-200" />

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                currentStep === 2
                  ? 'bg-cyan-600 text-white'
                  : currentStep > 2
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}
            >
              {currentStep === 2 ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentStep > 2 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className={currentStep >= 2 ? 'text-cyan-900' : 'text-gray-500'}>
                Generating Test Scripts
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentStep === 2 ? 'In Progress...' : currentStep > 2 ? 'Completed' : 'Pending'}
              </p>
            </div>
          </div>

          <Separator className="bg-cyan-200" />

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                currentStep === 3
                  ? 'bg-cyan-600 text-white'
                  : currentStep > 3
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}
            >
              {currentStep === 3 ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentStep > 3 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className={currentStep >= 3 ? 'text-cyan-900' : 'text-gray-500'}>
                Converting to JSON
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentStep === 3 ? 'In Progress...' : currentStep > 3 ? 'Completed' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {currentStep === 0 && (
          <Card className="mt-6 p-4 bg-gray-50 border-gray-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">Ready to Generate</p>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in the feature details and click "Create Test Script" to begin
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
