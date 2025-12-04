import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  X,
  Save,
  Sparkles,
  AlertCircle,
  FileCode,
  Plus,
  Trash2
} from 'lucide-react';
import { Feature, Project, APISpecification } from '../types/models';
import { sampleAPISpecs } from '../data/sampleData';

interface FeatureFormProps {
  project: Project;
  feature?: Feature | null;
  onSave: (feature: Feature) => void;
  onCancel: () => void;
}

export function FeatureForm({ project, feature, onSave, onCancel }: FeatureFormProps) {
  const isEditMode = !!feature;

  const [formData, setFormData] = useState({
    name: feature?.name || '',
    description: feature?.description || '',
    status: feature?.status || 'pending' as 'pending' | 'in-progress' | 'completed',
    apiSpecs: feature?.apiSpecs || [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get available API specs (filter by project context if needed)
  const availableApiSpecs = sampleAPISpecs;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Feature name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Feature name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Feature description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      const now = new Date().toISOString();
      const savedFeature: Feature = {
        id: feature?.id || `feat-${Date.now()}`,
        projectId: project.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        apiSpecs: formData.apiSpecs,
        createdBy: feature?.createdBy || 'user-001',
        createdAt: feature?.createdAt || now,
        updatedAt: now,
      };

      onSave(savedFeature);
      setIsSaving(false);

      // Show success toast
      toast.success(
        isEditMode ? 'Feature updated successfully!' : 'Feature created successfully!',
        {
          description: `${formData.name} has been ${isEditMode ? 'updated' : 'added'} to ${project.name}`,
        }
      );
    }, 800);
  };

  const handleAddApiSpec = (specId: string) => {
    if (!formData.apiSpecs.includes(specId)) {
      setFormData({
        ...formData,
        apiSpecs: [...formData.apiSpecs, specId],
      });
    }
  };

  const handleRemoveApiSpec = (specId: string) => {
    setFormData({
      ...formData,
      apiSpecs: formData.apiSpecs.filter(id => id !== specId),
    });
  };

  const getApiSpecName = (specId: string) => {
    return availableApiSpecs.find(spec => spec.id === specId)?.name || specId;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl bg-white border-blue-200 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-blue-900 mb-1">
                  {isEditMode ? 'Edit Feature' : 'Create New Feature'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEditMode ? 'Update feature details' : 'Add a new feature to'} {project.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feature Name */}
            <div>
              <Label htmlFor="name" className="text-gray-700">
                Feature Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) {
                    setErrors({ ...errors, name: '' });
                  }
                }}
                placeholder="e.g., User Authentication & Session Management"
                className={`mt-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Feature Description */}
            <div>
              <Label htmlFor="description" className="text-gray-700">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) {
                    setErrors({ ...errors, description: '' });
                  }
                }}
                placeholder="Describe what this feature does and what APIs it includes..."
                className={`mt-2 min-h-24 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Feature Status */}
            <div>
              <Label htmlFor="status" className="text-gray-700">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span>Pending</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>In Progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Completed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* API Specifications */}
            <div>
              <Label className="text-gray-700 mb-2 block">
                API Specifications
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Select the API specifications that are part of this feature
              </p>

              {/* Selected API Specs */}
              {formData.apiSpecs.length > 0 && (
                <div className="mb-3 space-y-2">
                  {formData.apiSpecs.map((specId) => (
                    <div
                      key={specId}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileCode className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-900">{getApiSpecName(specId)}</p>
                          <p className="text-xs text-gray-500">
                            {availableApiSpecs.find(s => s.id === specId)?.method} • {availableApiSpecs.find(s => s.id === specId)?.endpoint}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveApiSpec(specId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add API Spec Selector */}
              <Select onValueChange={handleAddApiSpec}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Add API specification..." />
                </SelectTrigger>
                <SelectContent>
                  {availableApiSpecs
                    .filter(spec => !formData.apiSpecs.includes(spec.id))
                    .map((spec) => (
                      <SelectItem key={spec.id} value={spec.id}>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                            {spec.method}
                          </Badge>
                          <span>{spec.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  {availableApiSpecs.filter(spec => !formData.apiSpecs.includes(spec.id)).length === 0 && (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      All API specs added
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Info Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Features organize related API specifications for testing. You can add API specs now or later.
              </AlertDescription>
            </Alert>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-blue-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <p className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Feature' : 'Create Feature'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
