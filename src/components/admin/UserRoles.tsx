
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  User, 
  Trash, 
  Edit, 
  Check, 
  X, 
  Mail, 
  Home, 
  CheckSquare 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

type UserRole = 'admin' | 'housekeeper';

interface Staff {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  permissions: {
    viewVillas: boolean;
    editVillas: boolean;
    viewReservations: boolean;
    editReservations: boolean;
    viewTasks: boolean;
    editTasks: boolean;
    sendEmails: boolean;
    manageUsers: boolean;
  };
}

// Default permissions by role
const defaultPermissions = {
  admin: {
    viewVillas: true,
    editVillas: true,
    viewReservations: true,
    editReservations: true,
    viewTasks: true,
    editTasks: true,
    sendEmails: true,
    manageUsers: true,
  },
  housekeeper: {
    viewVillas: false,
    editVillas: false,
    viewReservations: false,
    editReservations: false,
    viewTasks: true,
    editTasks: false,
    sendEmails: false,
    manageUsers: false,
  }
};

// Mock staff data
const initialStaff: Staff[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@hypnoticvillas.com',
    role: 'admin',
    permissions: defaultPermissions.admin
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria@hypnoticvillas.com',
    role: 'housekeeper',
    permissions: defaultPermissions.housekeeper
  },
  {
    id: 3,
    name: 'John Miller',
    email: 'john@hypnoticvillas.com',
    role: 'housekeeper',
    permissions: {
      ...defaultPermissions.housekeeper,
      editTasks: true
    }
  }
];

const UserRoles = () => {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const { toast } = useToast();
  
  const addForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'housekeeper' as UserRole,
      permissions: defaultPermissions.housekeeper
    }
  });
  
  const editForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'housekeeper' as UserRole,
      permissions: defaultPermissions.housekeeper
    }
  });

  const handleAddUser = (data: any) => {
    const newStaff: Staff = {
      id: staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1,
      name: data.name,
      email: data.email,
      role: data.role,
      permissions: data.permissions
    };
    
    setStaff([...staff, newStaff]);
    toast({
      title: "Staff added",
      description: `${newStaff.name} has been added as ${newStaff.role}.`
    });
    
    setIsAddModalOpen(false);
    addForm.reset();
  };

  const handleOpenEditModal = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    editForm.reset({
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      permissions: { ...staffMember.permissions }
    });
    setIsEditModalOpen(true);
  };

  const handleEditUser = (data: any) => {
    if (!editingStaff) return;
    
    const updatedStaff = staff.map(s => 
      s.id === editingStaff.id 
        ? { ...s, name: data.name, email: data.email, role: data.role, permissions: data.permissions } 
        : s
    );
    
    setStaff(updatedStaff);
    toast({
      title: "Staff updated",
      description: `${data.name}'s information has been updated.`
    });
    
    setIsEditModalOpen(false);
    setEditingStaff(null);
  };

  const handleDeleteUser = (id: number) => {
    const staffToDelete = staff.find(s => s.id === id);
    if (!staffToDelete) return;
    
    setStaff(staff.filter(s => s.id !== id));
    toast({
      title: "Staff removed",
      description: `${staffToDelete.name} has been removed.`
    });
  };

  const handleRoleChange = (value: UserRole, form: any) => {
    form.setValue('role', value);
    form.setValue('permissions', defaultPermissions[value]);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light">User Management</h2>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add Staff
          </Button>
        </div>
        
        <Card className="bg-hypnotic-darker border-hypnotic-accent">
          <CardHeader>
            <CardTitle>Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        staffMember.role === 'admin' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {staffMember.role === 'admin' ? 'Admin' : 'Housekeeper'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {staffMember.permissions.viewVillas && <Home size={14} className="text-gray-400" />}
                        {staffMember.permissions.viewTasks && <CheckSquare size={14} className="text-gray-400" />}
                        {staffMember.permissions.sendEmails && <Mail size={14} className="text-gray-400" />}
                        {staffMember.permissions.manageUsers && <User size={14} className="text-gray-400" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenEditModal(staffMember)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteUser(staffMember.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[525px] bg-hypnotic-darker text-white">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddUser)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    {...addForm.register('name')}
                    className="bg-hypnotic-dark border-hypnotic-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...addForm.register('email')}
                    className="bg-hypnotic-dark border-hypnotic-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  onValueChange={(value: UserRole) => handleRoleChange(value, addForm)}
                  defaultValue={addForm.getValues('role')}
                >
                  <SelectTrigger className="bg-hypnotic-dark border-hypnotic-accent">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="housekeeper">Housekeeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm">Permissions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="viewVillas"
                      checked={addForm.watch('permissions.viewVillas')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.viewVillas', Boolean(checked))
                      }
                    />
                    <label htmlFor="viewVillas" className="text-sm">View Villas</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="editVillas"
                      checked={addForm.watch('permissions.editVillas')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.editVillas', Boolean(checked))
                      }
                    />
                    <label htmlFor="editVillas" className="text-sm">Edit Villas</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="viewReservations"
                      checked={addForm.watch('permissions.viewReservations')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.viewReservations', Boolean(checked))
                      }
                    />
                    <label htmlFor="viewReservations" className="text-sm">View Reservations</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="editReservations"
                      checked={addForm.watch('permissions.editReservations')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.editReservations', Boolean(checked))
                      }
                    />
                    <label htmlFor="editReservations" className="text-sm">Edit Reservations</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="viewTasks"
                      checked={addForm.watch('permissions.viewTasks')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.viewTasks', Boolean(checked))
                      }
                    />
                    <label htmlFor="viewTasks" className="text-sm">View Tasks</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="editTasks"
                      checked={addForm.watch('permissions.editTasks')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.editTasks', Boolean(checked))
                      }
                    />
                    <label htmlFor="editTasks" className="text-sm">Edit Tasks</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sendEmails"
                      checked={addForm.watch('permissions.sendEmails')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.sendEmails', Boolean(checked))
                      }
                    />
                    <label htmlFor="sendEmails" className="text-sm">Send Emails</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="manageUsers"
                      checked={addForm.watch('permissions.manageUsers')}
                      onCheckedChange={(checked) => 
                        addForm.setValue('permissions.manageUsers', Boolean(checked))
                      }
                    />
                    <label htmlFor="manageUsers" className="text-sm">Manage Users</label>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-white/30 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
                >
                  <Check size={16} />
                  Add User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[525px] bg-hypnotic-darker text-white">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Full Name"
                    {...editForm.register('name')}
                    className="bg-hypnotic-dark border-hypnotic-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="email@example.com"
                    {...editForm.register('email')}
                    className="bg-hypnotic-dark border-hypnotic-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  onValueChange={(value: UserRole) => handleRoleChange(value, editForm)}
                  defaultValue={editForm.getValues('role')}
                >
                  <SelectTrigger id="edit-role" className="bg-hypnotic-dark border-hypnotic-accent">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="housekeeper">Housekeeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm">Permissions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-viewVillas"
                      checked={editForm.watch('permissions.viewVillas')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.viewVillas', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-viewVillas" className="text-sm">View Villas</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-editVillas"
                      checked={editForm.watch('permissions.editVillas')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.editVillas', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-editVillas" className="text-sm">Edit Villas</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-viewReservations"
                      checked={editForm.watch('permissions.viewReservations')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.viewReservations', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-viewReservations" className="text-sm">View Reservations</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-editReservations"
                      checked={editForm.watch('permissions.editReservations')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.editReservations', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-editReservations" className="text-sm">Edit Reservations</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-viewTasks"
                      checked={editForm.watch('permissions.viewTasks')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.viewTasks', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-viewTasks" className="text-sm">View Tasks</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-editTasks"
                      checked={editForm.watch('permissions.editTasks')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.editTasks', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-editTasks" className="text-sm">Edit Tasks</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-sendEmails"
                      checked={editForm.watch('permissions.sendEmails')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.sendEmails', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-sendEmails" className="text-sm">Send Emails</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-manageUsers"
                      checked={editForm.watch('permissions.manageUsers')}
                      onCheckedChange={(checked) => 
                        editForm.setValue('permissions.manageUsers', Boolean(checked))
                      }
                    />
                    <label htmlFor="edit-manageUsers" className="text-sm">Manage Users</label>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-white/30 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
                >
                  <Check size={16} />
                  Update
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRoles;
