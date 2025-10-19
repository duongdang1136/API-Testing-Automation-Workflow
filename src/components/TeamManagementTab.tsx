import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { 
  UserPlus, 
  Mail, 
  Shield, 
  Crown,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';
import { Project, TeamMember, AuthUser } from '../types/models';
import { toast } from 'sonner@2.0.3';

interface TeamManagementTabProps {
  project: Project;
  currentUser: AuthUser;
  onUpdateProject: (project: Project) => void;
}

export function TeamManagementTab({ project, currentUser, onUpdateProject }: TeamManagementTabProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState<'viewer' | 'editor' | 'admin' | 'owner'>('viewer');

  const currentUserRole = project.teamMembers.find(m => m.userId === currentUser.id)?.role || 'viewer';
  const canManageTeam = currentUserRole === 'owner' || currentUserRole === 'admin';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'editor': return <Edit3 className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'editor': return 'bg-green-100 text-green-700 border-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'owner': return 'Full control, can delete project';
      case 'admin': return 'Manage team, features, and settings';
      case 'editor': return 'Create and edit features and tests';
      case 'viewer': return 'View only, no edit permissions';
      default: return '';
    }
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if already a member
    const existingMember = project.teamMembers.find(m => m.userId === inviteEmail);
    if (existingMember) {
      toast.error('This user is already a member');
      return;
    }

    // Create new team member (in real app, this would send an invitation email)
    const newMember: TeamMember = {
      userId: inviteEmail, // In real app, this would be the user ID after they accept
      role: inviteRole,
      joinedAt: new Date().toISOString(),
    };

    const updatedProject = {
      ...project,
      teamMembers: [...project.teamMembers, newMember],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setShowInviteDialog(false);
    setInviteEmail('');
    setInviteRole('viewer');
  };

  const handleUpdateRole = () => {
    if (!editingMember) return;

    const updatedMembers = project.teamMembers.map(m =>
      m.userId === editingMember.userId ? { ...m, role: newRole } : m
    );

    const updatedProject = {
      ...project,
      teamMembers: updatedMembers,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    toast.success('Member role updated successfully');
    setEditingMember(null);
  };

  const handleRemoveMember = () => {
    if (!removingMember) return;

    const updatedMembers = project.teamMembers.filter(m => m.userId !== removingMember.userId);

    const updatedProject = {
      ...project,
      teamMembers: updatedMembers,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    toast.success('Member removed from project');
    setRemovingMember(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-600">
            Manage who can access and collaborate on this project
          </p>
        </div>
        {canManageTeam && (
          <Button
            onClick={() => setShowInviteDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Role Permissions Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="text-blue-900 mb-3">Role Permissions</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {['owner', 'admin', 'editor', 'viewer'].map((role) => (
            <div key={role} className="flex items-start gap-2">
              <Badge className={`${getRoleColor(role)} mt-0.5`}>
                <span className="flex items-center gap-1">
                  {getRoleIcon(role)}
                  <span className="capitalize">{role}</span>
                </span>
              </Badge>
              <p className="text-gray-700">{getRoleDescription(role)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Members List */}
      <div className="space-y-3">
        {project.teamMembers.map((member) => {
          const isCurrentUser = member.userId === currentUser.id;
          const canEdit = canManageTeam && !isCurrentUser && member.role !== 'owner';
          const canRemove = canManageTeam && !isCurrentUser && member.role !== 'owner';

          return (
            <Card key={member.userId} className="p-4 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">
                        {member.userId}
                        {isCurrentUser && <span className="text-gray-500"> (You)</span>}
                      </p>
                      <Badge className={getRoleColor(member.role)}>
                        <span className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          <span className="capitalize">{member.role}</span>
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Joined {new Date(member.joinedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingMember(member);
                        setNewRole(member.role);
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Change Role
                    </Button>
                  )}
                  {canRemove && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRemovingMember(member)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to collaborate on this project
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={(value: 'viewer' | 'editor' | 'admin') => setInviteRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>Viewer - View only access</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="editor">
                    <span className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Editor - Can create and edit</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="admin">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Admin - Full management access</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              <p>An invitation email will be sent to this address with instructions to join the project.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update permissions for {editingMember?.userId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Select value={newRole} onValueChange={(value: 'viewer' | 'editor' | 'admin' | 'owner') => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Viewer - View only</span>
                  </span>
                </SelectItem>
                <SelectItem value="editor">
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Editor - Can create and edit</span>
                  </span>
                </SelectItem>
                <SelectItem value="admin">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Admin - Full management</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} className="bg-blue-600 hover:bg-blue-700 text-white">
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <AlertDialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {removingMember?.userId} from this project? 
              They will lose all access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemovingMember(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
