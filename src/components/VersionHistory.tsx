import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Download,
  Eye,
  GitBranch,
  Calendar,
  User,
  FileCode,
  Plus,
  Minus,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Project, Version, Feature } from '../types/models';
import { sampleVersions } from '../data/sampleData';

interface VersionHistoryProps {
  project: Project;
  feature?: Feature;
  onBack: () => void;
}

export function VersionHistory({ project, feature, onBack }: VersionHistoryProps) {
  const [versions] = useState<Version[]>(
    sampleVersions.filter(v => 
      v.projectId === project.id && (!feature || v.featureId === feature.id)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(versions[0] || null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'deprecated': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4 text-green-600" />;
      case 'removed': return <Minus className="w-4 h-4 text-red-600" />;
      case 'modified': return <Edit className="w-4 h-4 text-yellow-600" />;
      case 'fixed': return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      default: return <Edit className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-50 border-green-200 text-green-900';
      case 'removed': return 'bg-red-50 border-red-200 text-red-900';
      case 'modified': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'fixed': return 'bg-blue-50 border-blue-200 text-blue-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
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
            className="border-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-blue-900 mb-2">Version History</h1>
            <p className="text-gray-600">
              {feature ? `${feature.name} - ${project.name}` : project.name}
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <GitBranch className="w-4 h-4 mr-2" />
          Create New Version
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-blue-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Versions</p>
              <p className="text-2xl text-blue-900">{versions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl text-green-900">
                {versions.filter(v => v.status === 'published').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-yellow-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl text-yellow-900">
                {versions.filter(v => v.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-indigo-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileCode className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Test Scripts</p>
              <p className="text-2xl text-indigo-900">
                {versions.reduce((sum, v) => sum + v.testScripts.length, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {versions.length === 0 ? (
        <Card className="p-12 border-blue-200 bg-white text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">No versions yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first version to track test script changes
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <GitBranch className="w-4 h-4 mr-2" />
                Create Version
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Version List */}
          <div className="lg:col-span-1">
            <Card className="p-4 border-blue-200 bg-white">
              <h3 className="text-blue-900 mb-4">All Versions</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    onClick={() => setSelectedVersion(version)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedVersion?.id === version.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-blue-600 text-white">
                        v{version.versionNumber}
                      </Badge>
                      <Badge className={getStatusColor(version.status)} variant="outline">
                        {version.status}
                      </Badge>
                    </div>
                    <h4 className="text-sm text-gray-900 mb-1">{version.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(version.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Version Detail */}
          <div className="lg:col-span-2">
            {selectedVersion && (
              <Card className="p-6 border-blue-200 bg-white">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-blue-600 text-white">
                        v{selectedVersion.versionNumber}
                      </Badge>
                      <Badge className={getStatusColor(selectedVersion.status)}>
                        {selectedVersion.status}
                      </Badge>
                    </div>
                    <h2 className="text-blue-900 mb-2">{selectedVersion.title}</h2>
                    <p className="text-gray-600">{selectedVersion.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-blue-300">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-300">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="changes" className="w-full">
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="changes">Changes</TabsTrigger>
                    <TabsTrigger value="scripts">Test Scripts</TabsTrigger>
                    <TabsTrigger value="collection">Postman Collection</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  </TabsList>

                  {/* Changes Tab */}
                  <TabsContent value="changes" className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-900">Version Changes</h4>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {selectedVersion.changes.length} changes
                      </Badge>
                    </div>

                    {selectedVersion.changes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No changes recorded for this version
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedVersion.changes.map((change, index) => (
                          <Card
                            key={index}
                            className={`p-4 border ${getChangeColor(change.type)}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getChangeIcon(change.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {change.type}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(change.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{change.description}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Test Scripts Tab */}
                  <TabsContent value="scripts">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-gray-900">Test Scripts</h4>
                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                          {selectedVersion.testScripts.length} scripts
                        </Badge>
                      </div>

                      {selectedVersion.testScripts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No test scripts in this version
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedVersion.testScripts.map((scriptId, index) => (
                            <Card key={scriptId} className="p-4 border-gray-200 bg-white">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileCode className="w-5 h-5 text-indigo-500" />
                                  <div>
                                    <p className="text-sm text-gray-900">
                                      Test Script #{index + 1}
                                    </p>
                                    <p className="text-xs text-gray-500">{scriptId}</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-gray-300">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Postman Collection Tab */}
                  <TabsContent value="collection">
                    <div className="space-y-4">
                      {selectedVersion.postmanCollection ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-gray-900">Postman Collection</h4>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                          <Card className="p-4 bg-gray-50 border-gray-200">
                            <pre className="text-xs overflow-x-auto">
                              {JSON.stringify(selectedVersion.postmanCollection, null, 2)}
                            </pre>
                          </Card>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No Postman collection available for this version
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Metadata Tab */}
                  <TabsContent value="metadata">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Version Number</p>
                          <p className="text-gray-900">{selectedVersion.versionNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Status</p>
                          <Badge className={getStatusColor(selectedVersion.status)}>
                            {selectedVersion.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Created By</p>
                          <p className="text-gray-900">{selectedVersion.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Created At</p>
                          <p className="text-gray-900">
                            {new Date(selectedVersion.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Project ID</p>
                          <p className="text-xs text-gray-700 font-mono">{selectedVersion.projectId}</p>
                        </div>
                        {selectedVersion.featureId && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Feature ID</p>
                            <p className="text-xs text-gray-700 font-mono">{selectedVersion.featureId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
