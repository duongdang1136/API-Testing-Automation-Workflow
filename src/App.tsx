import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ProjectDetail } from './components/ProjectDetail';
import { VersionHistory } from './components/VersionHistory';
import { CreateProjectModal } from './components/CreateProjectModal';
import { TestGenerationPage } from './components/TestGenerationPage';
import { TestRequirementsList } from './components/TestRequirementsList';
import { TestScriptsView } from './components/TestScriptsView';
import { RequirementCollectionStep } from './components/RequirementCollectionStep';
import { ScriptGenerationStep } from './components/ScriptGenerationStep';
import { PostmanExportStep } from './components/PostmanExportStep';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/sonner';
import { sampleProjects } from './data/sampleData';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles,
  FileText,
  Code2,
  FileJson,
  User,
  LogOut,
  FolderOpen,
  Home,
  Loader2
} from 'lucide-react';
import { APISpecification, TestRequirement, TestScript, AuthUser, Project, Feature, FeatureGenerationState, PostmanCollection } from './types/models';
import { generateTestScript, convertToPostmanCollection } from './utils/aiSimulator';
import { toast } from 'sonner@2.0.3';

type AppView = 
  | 'login'
  | 'register'
  | 'dashboard'
  | 'project-detail'
  | 'version-history'
  | 'test-generation'
  | 'test-generation-new'
  | 'test-requirements'
  | 'test-scripts';

export default function App() {
  // Authentication state
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  
  // Project management state
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  
  // New test generation workflow state
  const [generationState, setGenerationState] = useState<FeatureGenerationState | null>(null);
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
  const [isGeneratingJSON, setIsGeneratingJSON] = useState(false);
  
  // Legacy test generation workflow state (for old flow)
  const [currentStep, setCurrentStep] = useState(1);
  const [apiSpec, setApiSpec] = useState<APISpecification | null>(null);
  const [requirements, setRequirements] = useState<TestRequirement[]>([]);
  const [testScripts, setTestScripts] = useState<TestScript[]>([]);

  // Authentication handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleRegister = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setSelectedProject(null);
    setSelectedFeature(null);
    setCurrentStep(1);
    setApiSpec(null);
    setRequirements([]);
    setTestScripts([]);
  };

  // Project management handlers
  const handleCreateProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      setSelectedProject(null);
      setCurrentView('dashboard');
    }
  };

  // Navigation handlers
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setSelectedFeature(null);
    setCurrentView('dashboard');
  };

  const handleStartTestGeneration = (feature: Feature) => {
    setSelectedFeature(feature);
    
    // Check if feature has existing generation state
    if (feature.status === 'completed' && feature.generationState) {
      // Load existing generation state and go to test scripts view
      setGenerationState({
        feature,
        step: 'json',
        requirements: feature.generationState.requirements,
        testScripts: feature.generationState.testScripts,
        postmanCollection: feature.generationState.postmanCollection,
      });
      setCurrentView('test-scripts');
    } else if (feature.status === 'in-progress' && feature.generationState) {
      // Load existing requirements and go to test requirements view
      setGenerationState({
        feature,
        step: 'requirements',
        requirements: feature.generationState.requirements,
        testScripts: feature.generationState.testScripts || [],
        postmanCollection: feature.generationState.postmanCollection,
      });
      setCurrentView('test-requirements');
    } else {
      // Start fresh - go to feature creation page
      setGenerationState(null);
      setCurrentView('test-generation-new');
    }
  };

  const handleStartNewFeature = () => {
    if (!selectedProject) return;
    setSelectedFeature(null);
    setGenerationState(null);
    setCurrentView('test-generation-new');
  };

  const handleRequirementsGenerated = (requirements: TestRequirement[], feature: Feature) => {
    // Update feature with generation state
    const updatedFeature = {
      ...feature,
      generationState: {
        requirements,
        testScripts: [],
      }
    };

    // Update or add feature to project
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject?.id) {
        const featureExists = p.features.some(f => f.id === feature.id);
        return {
          ...p,
          features: featureExists 
            ? p.features.map(f => f.id === feature.id ? updatedFeature : f)
            : [...p.features, updatedFeature]
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject?.id) || null);

    setGenerationState({
      feature: updatedFeature,
      step: 'requirements',
      requirements,
      testScripts: [],
    });
    setCurrentView('test-requirements');
  };

  const handleGenerateScripts = async (selectedRequirements: TestRequirement[]) => {
    if (!generationState) return;

    setIsGeneratingScripts(true);
    try {
      // Simulate delay for AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate test scripts for each requirement
      const scripts: TestScript[] = [];
      selectedRequirements.forEach((req) => {
        // Create a mock API spec from the requirement
        const mockApiSpec: APISpecification = {
          id: req.specId,
          name: req.title,
          endpoint: '/api/v1/endpoint',
          method: 'POST',
          description: req.description,
          fields: [
            { name: 'field1', dataType: 'string', required: true, example: 'value1' },
            { name: 'field2', dataType: 'number', required: true, example: '123' },
          ],
          statusCodes: [
            { code: 200, description: 'Success', scenario: 'Valid request' },
            { code: 400, description: 'Bad Request', scenario: 'Invalid data' },
          ],
          businessRules: req.criteria,
          createdBy: currentUser?.id || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const script = generateTestScript(req, mockApiSpec, 'javascript');
        scripts.push(script);
      });

      const newGenerationState = {
        ...generationState,
        step: 'scripts' as const,
        testScripts: scripts,
      };

      setGenerationState(newGenerationState);

      // Update feature status and generation state
      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject?.id) {
          return {
            ...p,
            features: p.features.map(f => 
              f.id === generationState.feature.id 
                ? { 
                    ...f, 
                    status: 'in-progress' as const,
                    generationState: {
                      requirements: generationState.requirements,
                      testScripts: scripts,
                    }
                  }
                : f
            )
          };
        }
        return p;
      });
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject?.id) || null);

      setCurrentView('test-scripts');
      toast.success(`Generated ${scripts.length} test scripts!`);
    } catch (error) {
      toast.error('Failed to generate test scripts');
    } finally {
      setIsGeneratingScripts(false);
    }
  };

  const handleGenerateJSON = async () => {
    if (!generationState) return;

    setIsGeneratingJSON(true);
    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a mock API spec for the collection
      const mockApiSpec: APISpecification = {
        id: generationState.feature.id,
        name: generationState.feature.name,
        endpoint: '/api/v1/endpoint',
        method: 'POST',
        description: generationState.feature.description,
        fields: [],
        statusCodes: [],
        businessRules: [],
        createdBy: currentUser?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const collection = convertToPostmanCollection(generationState.testScripts, mockApiSpec);

      const newGenerationState = {
        ...generationState,
        step: 'json' as const,
        postmanCollection: collection,
      };

      setGenerationState(newGenerationState);

      // Update feature status to completed and save complete generation state
      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject?.id) {
          return {
            ...p,
            features: p.features.map(f => 
              f.id === generationState.feature.id 
                ? { 
                    ...f, 
                    status: 'completed' as const,
                    generationState: {
                      requirements: generationState.requirements,
                      testScripts: generationState.testScripts,
                      postmanCollection: collection,
                    }
                  }
                : f
            )
          };
        }
        return p;
      });
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject?.id) || null);

      toast.success('Postman collection generated successfully!');
    } catch (error) {
      toast.error('Failed to generate JSON');
    } finally {
      setIsGeneratingJSON(false);
    }
  };

  const handleViewVersions = () => {
    setCurrentView('version-history');
  };

  const handleBackToProject = () => {
    setCurrentView('project-detail');
  };

  const handleBackToProjectFromGeneration = () => {
    setCurrentStep(1);
    setApiSpec(null);
    setRequirements([]);
    setTestScripts([]);
    setCurrentView('project-detail');
  };

  // Test generation workflow handlers
  const handleStep1Complete = (spec: APISpecification, additionalInfo: string) => {
    setApiSpec(spec);
    setCurrentStep(2);
  };

  const handleStep2Complete = (scripts: TestScript[], reqs: TestRequirement[]) => {
    setTestScripts(scripts);
    setRequirements(reqs);
    setCurrentStep(3);
  };

  const steps = [
    {
      number: 1,
      title: 'Thu thập yêu cầu',
      subtitle: 'Collect Requirements',
      icon: FileText,
      color: 'blue',
    },
    {
      number: 2,
      title: 'Tạo test scripts',
      subtitle: 'Generate Scripts',
      icon: Code2,
      color: 'blue',
    },
    {
      number: 3,
      title: 'Xuất Postman',
      subtitle: 'Export to Postman',
      icon: FileJson,
      color: 'blue',
    },
  ];

  // Render login/register views
  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setCurrentView('register')} />;
  }

  if (currentView === 'register') {
    return <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setCurrentView('login')} />;
  }

  // Main authenticated app
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-cyan-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-cyan-900">AI Test Script Generator</h1>
                <p className="text-sm text-gray-600">Automated API Testing Workflow System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Breadcrumb Navigation */}
              {currentView !== 'dashboard' && (
                <div className="flex items-center gap-2 text-sm">
                  <button
                    onClick={handleBackToDashboard}
                    className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700"
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  {selectedProject && (
                    <>
                      <span className="text-gray-400">/</span>
                      <button
                        onClick={handleBackToProject}
                        className="text-cyan-600 hover:text-cyan-700"
                      >
                        {selectedProject.name}
                      </button>
                    </>
                  )}
                  {currentView === 'version-history' && (
                    <>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-600">Version History</span>
                    </>
                  )}
                  {(currentView === 'test-generation' || currentView === 'test-generation-new' || currentView === 'test-requirements' || currentView === 'test-scripts') && (
                    <>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-600">Test Generation</span>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right">
                  <p className="text-sm text-gray-900">{currentUser?.name}</p>
                  <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 text-xs">
                    {currentUser?.role}
                  </Badge>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard View */}
        {currentView === 'dashboard' && currentUser && (
          <>
            <ProjectDashboard
              currentUser={currentUser}
              onSelectProject={handleSelectProject}
              onCreateProject={() => setShowCreateProjectModal(true)}
              projects={projects}
            />
            <CreateProjectModal
              isOpen={showCreateProjectModal}
              onClose={() => setShowCreateProjectModal(false)}
              onSave={handleCreateProject}
              userId={currentUser.id}
            />
          </>
        )}

        {/* Project Detail View */}
        {currentView === 'project-detail' && selectedProject && currentUser && (
          <ProjectDetail
            project={selectedProject}
            currentUser={currentUser}
            onBack={handleBackToDashboard}
            onStartTestGeneration={handleStartTestGeneration}
            onViewVersions={handleViewVersions}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onCreateNewFeature={handleStartNewFeature}
          />
        )}

        {/* Version History View */}
        {currentView === 'version-history' && selectedProject && (
          <VersionHistory
            project={selectedProject}
            feature={selectedFeature || undefined}
            onBack={handleBackToProject}
          />
        )}

        {/* New Test Generation Flow - Create Feature Page */}
        {currentView === 'test-generation-new' && selectedProject && currentUser && (
          <TestGenerationPage
            project={selectedProject}
            feature={selectedFeature || null}
            currentUser={currentUser}
            onBack={handleBackToProject}
            onRequirementsGenerated={handleRequirementsGenerated}
            onSelectFeature={handleStartTestGeneration}
          />
        )}

        {/* Test Requirements View */}
        {currentView === 'test-requirements' && generationState && (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={handleBackToProject}
              className="border-cyan-300"
            >
              ← Back to Project
            </Button>

            <Card className="p-6 bg-gradient-to-r from-cyan-600 to-cyan-700 border-cyan-800 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-white">{generationState.feature.name}</h2>
                    <Badge className="bg-white/20 text-white border-white/30">
                      Step 1: Requirements
                    </Badge>
                  </div>
                  <p className="text-cyan-100">{generationState.feature.description}</p>
                </div>
              </div>
            </Card>

            <TestRequirementsList
              requirements={generationState.requirements}
              onGenerateScripts={handleGenerateScripts}
              onUpdateRequirements={(reqs) => setGenerationState({ ...generationState, requirements: reqs })}
              isGenerating={isGeneratingScripts}
            />
          </div>
        )}

        {/* Test Scripts View */}
        {currentView === 'test-scripts' && generationState && (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => setCurrentView('test-requirements')}
              className="border-cyan-300"
            >
              ← Back to Requirements
            </Button>

            <Card className="p-6 bg-gradient-to-r from-cyan-600 to-cyan-700 border-cyan-800 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-white">{generationState.feature.name}</h2>
                    <Badge className="bg-white/20 text-white border-white/30">
                      Step 2: Test Scripts
                    </Badge>
                  </div>
                  <p className="text-cyan-100">Review and export your generated test scripts</p>
                </div>
              </div>
            </Card>

            <TestScriptsView
              testScripts={generationState.testScripts}
              postmanCollection={generationState.postmanCollection}
              onGenerateJSON={handleGenerateJSON}
              isGenerating={isGeneratingJSON}
            />
          </div>
        )}

        {/* Test Generation Workflow (Legacy Flow) */}
        {currentView === 'test-generation' && selectedProject && selectedFeature && (
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={handleBackToProjectFromGeneration}
              className="border-cyan-300"
            >
              ← Back to Project
            </Button>

            {/* Feature Info Banner */}
            <Card className="p-6 bg-gradient-to-r from-cyan-600 to-cyan-700 border-cyan-800 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-white">Test Generation for: {selectedFeature.name}</h2>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {selectedProject.name}
                    </Badge>
                  </div>
                  <p className="text-cyan-100">{selectedFeature.description}</p>
                </div>
              </div>
            </Card>

            {/* Progress Steps */}
            <div className="bg-white border border-cyan-200 rounded-lg">
              <div className="px-6 py-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                            currentStep > step.number
                              ? 'bg-green-100 border-2 border-green-500'
                              : currentStep === step.number
                              ? 'bg-cyan-600 border-2 border-cyan-700 shadow-lg'
                              : 'bg-gray-100 border-2 border-gray-300'
                          }`}
                        >
                          {currentStep > step.number ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : currentStep === step.number ? (
                            <step.icon className="w-6 h-6 text-white" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`transition-all ${
                              currentStep >= step.number
                                ? 'text-cyan-900'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-sm text-gray-500">{step.subtitle}</p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="flex-shrink-0 w-24 h-0.5 mx-2">
                          <div
                            className={`h-full transition-all ${
                              currentStep > step.number
                                ? 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-cyan-200" />

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm border border-cyan-200 p-8">
              {currentStep === 1 && (
                <RequirementCollectionStep onComplete={handleStep1Complete} />
              )}
              
              {currentStep === 2 && apiSpec && (
                <ScriptGenerationStep 
                  apiSpec={apiSpec}
                  onComplete={handleStep2Complete}
                />
              )}
              
              {currentStep === 3 && apiSpec && testScripts.length > 0 && (
                <PostmanExportStep
                  apiSpec={apiSpec}
                  testScripts={testScripts}
                  requirements={requirements}
                />
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Powered by AI • {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="mt-1">System Version 2.1.0 • Last Updated: October 17, 2025</p>
            </div>
          </div>
        )}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
