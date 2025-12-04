import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertTriangle } from 'lucide-react';
import { Project } from '../types/models';
import { toast } from 'sonner@2.0.3';

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  project: Project;
  featureCount?: number;
}

export function DeleteProjectDialog({
  isOpen,
  onClose,
  onConfirm,
  project,
  featureCount = 0
}: DeleteProjectDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setIsValid(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsValid(confirmText === project.name);
  }, [confirmText, project.name]);

  const handleConfirm = () => {
    if (!isValid) {
      toast.error('Project name does not match');
      return;
    }

    onConfirm();
    toast.success('Project deleted successfully');
    setConfirmText('');
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-red-900">Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Message */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900 mb-3">
              You are about to permanently delete the project <strong>"{project.name}"</strong>.
            </p>
            <p className="text-sm text-red-800 mb-2">This will delete:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
              <li><strong>{featureCount}</strong> feature{featureCount !== 1 ? 's' : ''} and all test cases</li>
              <li>All test scripts and versions</li>
              <li>All team member associations</li>
              <li>All activity logs and history</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmText" className="text-gray-900">
              Type <span className="px-2 py-0.5 bg-gray-200 rounded font-mono text-sm">{project.name}</span> to confirm
            </Label>
            <Input
              id="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter project name"
              className={confirmText && !isValid ? 'border-red-500' : ''}
              autoComplete="off"
            />
            {confirmText && !isValid && (
              <p className="text-sm text-red-500">Project name does not match</p>
            )}
          </div>

          {/* Additional Warning */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-900">
                <strong>Important:</strong> Make sure you have exported any important data before deleting.
                This action is permanent and cannot be recovered.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isValid}
            className="bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
          >
            Delete Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
