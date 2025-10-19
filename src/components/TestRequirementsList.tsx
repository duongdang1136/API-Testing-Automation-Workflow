import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Plus,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { TestRequirement } from '../types/models';
import { toast } from 'sonner@2.0.3';

interface TestRequirementsListProps {
  requirements: TestRequirement[];
  onGenerateScripts: (selectedRequirements: TestRequirement[]) => void;
  onUpdateRequirements: (requirements: TestRequirement[]) => void;
  isGenerating?: boolean;
}

export function TestRequirementsList({
  requirements: initialRequirements,
  onGenerateScripts,
  onUpdateRequirements,
  isGenerating = false,
}: TestRequirementsListProps) {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialRequirements.map((r) => r.id))
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editingRequirement, setEditingRequirement] = useState<TestRequirement | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state for editing/adding
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    testType: 'happy' as TestRequirement['testType'],
    priority: 'high' as TestRequirement['priority'],
    criteria: [] as string[],
    criteriaInput: '',
  });

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleEdit = (requirement: TestRequirement) => {
    setEditingRequirement(requirement);
    setFormData({
      title: requirement.title,
      description: requirement.description,
      testType: requirement.testType,
      priority: requirement.priority,
      criteria: requirement.criteria,
      criteriaInput: '',
    });
  };

  const handleDelete = (id: string) => {
    const updated = requirements.filter((r) => r.id !== id);
    setRequirements(updated);
    onUpdateRequirements(updated);
    toast.success('Requirement deleted');
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRequirement) {
      // Update existing
      const updated = requirements.map((r) =>
        r.id === editingRequirement.id
          ? {
              ...r,
              title: formData.title,
              description: formData.description,
              testType: formData.testType,
              priority: formData.priority,
              criteria: formData.criteria,
            }
          : r
      );
      setRequirements(updated);
      onUpdateRequirements(updated);
      toast.success('Requirement updated');
    } else {
      // Add new
      const newReq: TestRequirement = {
        id: `req-${Date.now()}`,
        specId: `spec-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        testType: formData.testType,
        priority: formData.priority,
        criteria: formData.criteria,
        generatedAt: new Date().toISOString(),
      };
      const updated = [...requirements, newReq];
      setRequirements(updated);
      onUpdateRequirements(updated);
      setSelectedIds(new Set([...selectedIds, newReq.id]));
      toast.success('Requirement added');
    }

    setEditingRequirement(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      description: '',
      testType: 'happy',
      priority: 'high',
      criteria: [],
      criteriaInput: '',
    });
  };

  const handleAddCriteria = () => {
    if (formData.criteriaInput.trim()) {
      setFormData({
        ...formData,
        criteria: [...formData.criteria, formData.criteriaInput.trim()],
        criteriaInput: '',
      });
    }
  };

  const handleRemoveCriteria = (index: number) => {
    setFormData({
      ...formData,
      criteria: formData.criteria.filter((_, i) => i !== index),
    });
  };

  const handleGenerateScripts = () => {
    const selected = requirements.filter((r) => selectedIds.has(r.id));
    if (selected.length === 0) {
      toast.error('Please select at least one requirement');
      return;
    }
    onGenerateScripts(selected);
  };

  const getTestTypeColor = (type: TestRequirement['testType']) => {
    switch (type) {
      case 'happy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'exception':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'validation':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'business-rule':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: TestRequirement['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          Successfully generated {requirements.length} test requirement{requirements.length !== 1 ? 's' : ''}!
          Review and select the requirements you want to convert to test scripts.
        </AlertDescription>
      </Alert>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-cyan-900">Test Requirements</h3>
          <p className="text-sm text-gray-600">
            {selectedIds.size} of {requirements.length} selected
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsAddingNew(true)}
            className="border-cyan-300 text-cyan-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Manual
          </Button>
          <Button
            onClick={() => setSelectedIds(new Set(requirements.map((r) => r.id)))}
            variant="outline"
            className="border-cyan-300"
          >
            Select All
          </Button>
          <Button
            onClick={() => setSelectedIds(new Set())}
            variant="outline"
            className="border-cyan-300"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Requirements List */}
      <ScrollArea className="h-[500px] rounded-lg border border-cyan-200">
        <div className="p-4 space-y-3">
          {requirements.map((req) => {
            const isSelected = selectedIds.has(req.id);
            const isExpanded = expandedIds.has(req.id);

            return (
              <Card
                key={req.id}
                className={`transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-50'
                    : 'border-gray-200 hover:border-cyan-300'
                }`}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(req.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-2">{req.title}</h4>
                          <p className="text-sm text-gray-600">{req.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getPriorityColor(req.priority)}>
                            {req.priority}
                          </Badge>
                          <Badge className={getTestTypeColor(req.testType)}>
                            {req.testType}
                          </Badge>
                        </div>
                      </div>

                      {/* Criteria Preview */}
                      {!isExpanded && req.criteria.length > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          {req.criteria.length} test criteria defined
                        </p>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm text-gray-700 mb-2">Test Criteria:</h5>
                          <ul className="space-y-1.5">
                            {req.criteria.map((criterion, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-cyan-600 mt-1">✓</span>
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => toggleExpanded(req.id)}
                          className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronRight className="w-4 h-4" />
                              Show Details
                            </>
                          )}
                        </button>
                        <Separator orientation="vertical" className="h-4" />
                        <button
                          onClick={() => handleEdit(req)}
                          className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Generate Scripts Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleGenerateScripts}
          disabled={selectedIds.size === 0 || isGenerating}
          className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Scripts...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Test Scripts ({selectedIds.size})
            </>
          )}
        </Button>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog
        open={!!editingRequirement || isAddingNew}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRequirement(null);
            setIsAddingNew(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRequirement ? 'Edit Test Requirement' : 'Add New Requirement'}
            </DialogTitle>
            <DialogDescription>
              {editingRequirement
                ? 'Update the details of this test requirement'
                : 'Create a new test requirement manually'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Validate successful user login"
                className="border-cyan-200"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this test requirement validates..."
                className="border-cyan-200"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Test Type</Label>
                <select
                  value={formData.testType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      testType: e.target.value as TestRequirement['testType'],
                    })
                  }
                  className="w-full px-3 py-2 border border-cyan-200 rounded-md"
                >
                  <option value="happy">Happy Path</option>
                  <option value="exception">Exception</option>
                  <option value="validation">Validation</option>
                  <option value="business-rule">Business Rule</option>
                </select>
              </div>

              <div>
                <Label>Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as TestRequirement['priority'],
                    })
                  }
                  className="w-full px-3 py-2 border border-cyan-200 rounded-md"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Test Criteria</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.criteriaInput}
                  onChange={(e) =>
                    setFormData({ ...formData, criteriaInput: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCriteria();
                    }
                  }}
                  placeholder="Add a test criterion..."
                  className="border-cyan-200"
                />
                <Button onClick={handleAddCriteria} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.criteria.length > 0 && (
                <div className="space-y-2 mt-3">
                  {formData.criteria.map((criterion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <span className="text-sm text-gray-700">{criterion}</span>
                      <button
                        onClick={() => handleRemoveCriteria(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingRequirement(null);
                setIsAddingNew(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
