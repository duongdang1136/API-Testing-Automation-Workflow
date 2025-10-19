import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Edit, AlertCircle } from 'lucide-react';
import { Project } from '../types/models';
import { toast } from 'sonner@2.0.3';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project: Project;
}

export function EditProjectModal({ isOpen, onClose, onSave, project }: EditProjectModalProps) {
  const [projectName, setProjectName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(project.status);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setProjectName(project.name);
      setDescription(project.description);
      setStatus(project.status);
      setErrors({});
    }
  }, [isOpen, project]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (projectName.length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters';
    }

    if (description && description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const updatedProject: Project = {
      ...project,
      name: projectName.trim(),
      description: description.trim(),
      status,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedProject);
    toast.success('Project updated successfully!');
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update project information and settings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectName"
              placeholder="e.g., FPT Play, E-commerce API"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (errors.projectName) {
                  setErrors({ ...errors, projectName: '' });
                }
              }}
              className={errors.projectName ? 'border-red-500' : ''}
            />
            {errors.projectName && (
              <p className="text-sm text-red-500">{errors.projectName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this project covers..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors({ ...errors, description: '' });
                }
              }}
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Optional - Add a brief description</span>
              <span>{description.length}/500</span>
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select value={status} onValueChange={(value: 'active' | 'draft' | 'archived') => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Draft - Still planning</span>
                  </div>
                </SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Active - In use</span>
                  </div>
                </SelectItem>
                <SelectItem value="archived">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>Archived - Inactive</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warning for Archive */}
          {status === 'archived' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-900">
                  <p>Archiving this project will:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-yellow-800">
                    <li>Hide it from active projects list</li>
                    <li>Prevent new features from being added</li>
                    <li>Keep all existing data accessible</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">
                  {new Date(project.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Team Members:</span>
                <span className="text-gray-900">{project.teamMembers.length}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
