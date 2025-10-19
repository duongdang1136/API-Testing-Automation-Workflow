import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Plus,
  Users,
  Sparkles,
  FileCode,
  History,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Project, Feature, Version, AuthUser } from '../types/models';
import { sampleFeatures, sampleVersions } from '../data/sampleData';
import { FeatureForm } from './FeatureForm';
import { TeamManagementTab } from './TeamManagementTab';
import { EditProjectModal } from './EditProjectModal';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface ProjectDetailProps {
  project: Project;
  currentUser: AuthUser;
  onBack: () => void;
  onStartTestGeneration: (feature: Feature) => void;
  onViewVersions: () => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject?: () => void;
  onCreateNewFeature?: () => void;
}

export function ProjectDetail({ 
  project, 
  currentUser, 
  onBack, 
  onStartTestGeneration,
  onViewVersions,
  onUpdateProject,
  onDeleteProject,
  onCreateNewFeature
}: ProjectDetailProps) {
  const [currentProject, setCurrentProject] = useState(project);
  const [features, setFeatures] = useState<Feature[]>(
    project.features.length > 0 ? project.features : sampleFeatures.filter(f => f.projectId === project.id)
  );
  const [versions] = useState<Version[]>(
    sampleVersions.filter(v => v.projectId === project.id)
  );
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [deletingFeature, setDeletingFeature] = useState<Feature | null>(null);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);

  // Update features when project changes (e.g., after generation)
  useEffect(() => {
    setCurrentProject(project);
    if (project.features.length > 0) {
      setFeatures(project.features);
    }
  }, [project]);

  const currentUserRole = currentProject.teamMembers.find(m => m.userId === currentUser.id)?.role || 'viewer';
  const canEditProject = currentUserRole === 'owner' || currentUserRole === 'admin';
  const canDeleteProject = currentUserRole === 'owner';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getFeatureVersions = (featureId: string) => {
    return versions.filter(v => v.featureId === featureId);
  };

  const handleCreateFeature = () => {
    if (onCreateNewFeature) {
      onCreateNewFeature();
    } else {
      setEditingFeature(null);
      setShowFeatureForm(true);
    }
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setShowFeatureForm(true);
  };

  const handleSaveFeature = (feature: Feature) => {
    if (editingFeature) {
      // Update existing feature
      setFeatures(features.map(f => f.id === feature.id ? feature : f));
    } else {
      // Add new feature
      setFeatures([...features, feature]);
    }
    setShowFeatureForm(false);
    setEditingFeature(null);
  };

  const handleDeleteFeature = (feature: Feature) => {
    setDeletingFeature(feature);
  };

  const confirmDeleteFeature = () => {
    if (deletingFeature) {
      const featureName = deletingFeature.name;
      setFeatures(features.filter(f => f.id !== deletingFeature.id));
      setDeletingFeature(null);
      
      // Show success toast
      toast.success('Feature deleted successfully!', {
        description: `${featureName} has been removed from ${project.name}`,
      });
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setCurrentProject(updatedProject);
    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
  };

  const handleDeleteProject = () => {
    if (onDeleteProject) {
      onDeleteProject();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-cyan-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-cyan-900 mb-2">{currentProject.name}</h1>
            <p className="text-gray-600">{currentProject.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={
            currentProject.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
            currentProject.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
            'bg-gray-100 text-gray-700 border-gray-200'
          }>
            {currentProject.status}
          </Badge>
          
          {canEditProject && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditProjectModal(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                {canDeleteProject && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteProjectDialog(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-purple-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Features</p>
              <p className="text-2xl text-purple-900">{features.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-indigo-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileCode className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Versions</p>
              <p className="text-2xl text-indigo-900">{versions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-cyan-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl text-cyan-900">{project.teamMembers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl text-green-900">
                {features.filter(f => f.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="features">
            <Sparkles className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="versions">
            <History className="w-4 h-4 mr-2" />
            Version History
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-cyan-900">Project Features</h3>
            <Button
              onClick={handleCreateFeature}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Feature
            </Button>
          </div>

          {features.length === 0 ? (
            <Card className="p-12 border-cyan-200 bg-white text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">No features yet</h4>
                  <p className="text-gray-600 mb-4">
                    Add your first feature to start generating test scripts
                  </p>
                  <Button 
                    onClick={handleCreateFeature}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => {
                const featureVersions = getFeatureVersions(feature.id);
                return (
                  <Card key={feature.id} className="p-6 border-blue-200 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-blue-900 mb-2">{feature.name}</h4>
                        <Badge className={getStatusColor(feature.status)}>
                          {getStatusIcon(feature.status)}
                          <span className="ml-1">{feature.status}</span>
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">API Specs</span>
                        <span className="text-gray-900">{feature.apiSpecs.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Versions</span>
                        <span className="text-gray-900">{featureVersions.length}</span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                        Updated {new Date(feature.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => onStartTestGeneration(feature)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Generate Tests
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditFeature(feature)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFeature(feature)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Version History Tab */}
        <TabsContent value="versions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-blue-900">Version History</h3>
            <Button
              onClick={onViewVersions}
              variant="outline"
              className="border-blue-300 text-blue-700"
            >
              <History className="w-4 h-4 mr-2" />
              View All Versions
            </Button>
          </div>

          {versions.length === 0 ? (
            <Card className="p-12 border-blue-200 bg-white text-center">
              <p className="text-gray-600">No versions created yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {versions.slice(0, 5).map((version) => (
                <Card key={version.id} className="p-4 border-blue-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-blue-600 text-white">
                          v{version.versionNumber}
                        </Badge>
                        <h4 className="text-gray-900">{version.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{version.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(version.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={
                      version.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' :
                      version.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }>
                      {version.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <TeamManagementTab
            project={currentProject}
            currentUser={currentUser}
            onUpdateProject={handleUpdateProject}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="p-6 border-blue-200 bg-white">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Project Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">Project Name</p>
                      <p className="text-sm text-gray-600">{currentProject.name}</p>
                    </div>
                    {canEditProject && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowEditProjectModal(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">Project Status</p>
                      <Badge className={
                        currentProject.status === 'active' ? 'bg-green-100 text-green-700 border-green-200 mt-2' :
                        currentProject.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 mt-2' :
                        'bg-gray-100 text-gray-700 border-gray-200 mt-2'
                      }>
                        {currentProject.status}
                      </Badge>
                    </div>
                    {canEditProject && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowEditProjectModal(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 mb-2">Project Information</p>
                    <div className="text-sm space-y-1 text-gray-600">
                      <p>Created: {new Date(currentProject.createdAt).toLocaleDateString()}</p>
                      <p>Last Updated: {new Date(currentProject.updatedAt).toLocaleDateString()}</p>
                      <p>Features: {features.length}</p>
                      <p>Team Members: {currentProject.teamMembers.length}</p>
                    </div>
                  </div>

                  {canDeleteProject && (
                    <>
                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <h4 className="text-red-900 mb-2">Danger Zone</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Once you delete a project, there is no going back. Please be certain.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteProjectDialog(true)}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete This Project
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feature Form Modal */}
      {showFeatureForm && (
        <FeatureForm
          project={project}
          feature={editingFeature}
          onSave={handleSaveFeature}
          onCancel={() => {
            setShowFeatureForm(false);
            setEditingFeature(null);
          }}
        />
      )}

      {/* Delete Feature Confirmation Dialog */}
      <AlertDialog open={!!deletingFeature} onOpenChange={() => setDeletingFeature(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingFeature?.name}</strong>?
              <br />
              <br />
              This will remove the feature and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFeature}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Feature
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Project Modal */}
      {showEditProjectModal && (
        <EditProjectModal
          isOpen={showEditProjectModal}
          onClose={() => setShowEditProjectModal(false)}
          onSave={handleUpdateProject}
          project={currentProject}
        />
      )}

      {/* Delete Project Dialog */}
      {showDeleteProjectDialog && (
        <DeleteProjectDialog
          isOpen={showDeleteProjectDialog}
          onClose={() => setShowDeleteProjectDialog(false)}
          onConfirm={handleDeleteProject}
          project={currentProject}
          featureCount={features.length}
        />
      )}
    </div>
  );
}
