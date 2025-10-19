import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar, 
  Users,
  Sparkles,
  FileCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { Project, Feature, AuthUser } from '../types/models';
import { sampleProjects, sampleFeatures, sampleVersions } from '../data/sampleData';

interface ProjectDashboardProps {
  currentUser: AuthUser;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  projects?: Project[];
}

export function ProjectDashboard({ currentUser, onSelectProject, onCreateProject, projects: propProjects }: ProjectDashboardProps) {
  const [projects] = useState<Project[]>(propProjects || sampleProjects);
  const [features] = useState<Feature[]>(sampleFeatures);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectFeatures = (projectId: string) => {
    return features.filter(f => f.projectId === projectId);
  };

  const getProjectVersionCount = (projectId: string) => {
    return sampleVersions.filter(v => v.projectId === projectId).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFeatureStatusCount = (projectId: string) => {
    const projectFeatures = getProjectFeatures(projectId);
    return {
      completed: projectFeatures.filter(f => f.status === 'completed').length,
      inProgress: projectFeatures.filter(f => f.status === 'in-progress').length,
      pending: projectFeatures.filter(f => f.status === 'pending').length,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-blue-900">Project Dashboard</h1>
          <p className="text-gray-600">Manage your API testing projects and features</p>
        </div>
        <Button
          onClick={onCreateProject}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-blue-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Projects</p>
              <p className="text-3xl text-blue-900">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-green-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Projects</p>
              <p className="text-3xl text-green-900">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-purple-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Features</p>
              <p className="text-3xl text-purple-900">{features.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-indigo-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Test Versions</p>
              <p className="text-3xl text-indigo-900">{sampleVersions.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileCode className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 border-blue-200 bg-white">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'bg-blue-600' : ''}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
              className={statusFilter === 'active' ? 'bg-green-600' : ''}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
              className={statusFilter === 'draft' ? 'bg-yellow-600' : ''}
            >
              Draft
            </Button>
          </div>

          <div className="flex items-center gap-2 border-l pl-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-blue-600' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-blue-600' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 border-blue-200 bg-white text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Create your first project to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.map((project) => {
            const projectFeatures = getProjectFeatures(project.id);
            const statusCount = getFeatureStatusCount(project.id);
            const versionCount = getProjectVersionCount(project.id);

            return (
              <Card
                key={project.id}
                className="p-6 border-blue-200 bg-white hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-blue-900 mb-1">{project.name}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">Features</span>
                    </div>
                    <span className="text-gray-900">{projectFeatures.length}</span>
                  </div>

                  {projectFeatures.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-gray-600">{statusCount.completed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-600" />
                        <span className="text-gray-600">{statusCount.inProgress}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{statusCount.pending}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-indigo-500" />
                      <span className="text-gray-600">Versions</span>
                    </div>
                    <span className="text-gray-900">{versionCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">Team</span>
                    </div>
                    <span className="text-gray-900">{project.teamMembers.length}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Updated {new Date(project.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
