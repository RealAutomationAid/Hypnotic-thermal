
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, UserPlus, Clock, Check } from 'lucide-react';

type TaskStatus = 'todo' | 'inProgress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
  dueDate: string;
  reservationId: number | null;
  priority: TaskPriority;
}

// Mock task data
const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Clean Villa 2 after checkout',
    description: 'Full cleaning service including changing linens',
    status: 'todo',
    assignedTo: 'Maria',
    dueDate: '2023-10-15',
    reservationId: 2,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Restock minibar in Villa 3',
    description: 'Add new water bottles, wine, and snacks',
    status: 'inProgress',
    assignedTo: 'John',
    dueDate: '2023-10-15',
    reservationId: 3,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Fix shower head in Villa 1',
    description: 'Guest reported low water pressure',
    status: 'todo',
    assignedTo: 'Alex',
    dueDate: '2023-10-16',
    reservationId: 1,
    priority: 'high'
  },
  {
    id: 4,
    title: 'General garden maintenance',
    description: 'Trim hedges and water plants',
    status: 'done',
    assignedTo: 'Maria',
    dueDate: '2023-10-14',
    reservationId: null,
    priority: 'low'
  },
  {
    id: 5,
    title: 'Prepare welcome package',
    description: 'For guests arriving on Oct 20',
    status: 'inProgress',
    assignedTo: 'John',
    dueDate: '2023-10-19',
    reservationId: null,
    priority: 'medium'
  }
];

const AdminTaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [currentlyDragging, setCurrentlyDragging] = useState<number | null>(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      reservationId: '',
      priority: 'medium' as TaskPriority,
    }
  });

  const onSubmit = (data: any) => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: data.title,
      description: data.description,
      status: 'todo',
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
      reservationId: data.reservationId ? parseInt(data.reservationId) : null,
      priority: data.priority as TaskPriority,
    };
    
    setTasks([...tasks, newTask]);
    setIsNewTaskModalOpen(false);
    form.reset();
  };

  const handleDragStart = (taskId: number) => {
    setCurrentlyDragging(taskId);
  };

  const handleDrop = (status: TaskStatus) => {
    if (currentlyDragging !== null) {
      setTasks(tasks.map(task => 
        task.id === currentlyDragging ? { ...task, status } : task
      ));
      setCurrentlyDragging(null);
    }
  };
  
  const getPriorityColor = (priority: TaskPriority) => {
    switch(priority) {
      case 'high': return 'bg-red-900/30 text-red-300';
      case 'medium': return 'bg-amber-900/30 text-amber-300';
      case 'low': return 'bg-green-900/30 text-green-300';
    }
  };

  const renderTaskColumn = (status: TaskStatus, title: string) => {
    const filteredTasks = tasks.filter(task => task.status === status);
    
    return (
      <div 
        className="bg-hypnotic-darker rounded-md p-4 min-h-[500px] w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(status)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{title}</h3>
          <span className="bg-hypnotic-gray/20 text-hypnotic-gray text-xs px-2 py-1 rounded-full">
            {filteredTasks.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div 
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(task.id)}
              className="bg-hypnotic-dark p-3 rounded-md cursor-move hover:ring-1 hover:ring-hypnotic-accent"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{task.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              {task.reservationId && (
                <div className="text-xs text-hypnotic-gray mb-2">
                  Reservation #{task.reservationId}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2 text-xs text-hypnotic-gray">
                <div className="flex items-center">
                  <UserPlus className="h-3 w-3 mr-1" />
                  {task.assignedTo}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.dueDate}
                </div>
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="h-20 border border-dashed border-hypnotic-gray/20 rounded-md flex items-center justify-center text-hypnotic-gray text-sm">
              No tasks
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light">Task Board</h2>
        <Button
          className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          <Plus size={16} />
          New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderTaskColumn('todo', 'To Do')}
        {renderTaskColumn('inProgress', 'In Progress')}
        {renderTaskColumn('done', 'Done')}
      </div>
      
      {/* New Task Modal */}
      <Dialog open={isNewTaskModalOpen} onOpenChange={setIsNewTaskModalOpen}>
        <DialogContent className="bg-hypnotic-darker text-white border-hypnotic-gray/30">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of the task" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Task details" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <FormControl>
                        <Input placeholder="Staff member name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reservationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Linked Reservation (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Reservation #" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                          <Button
                            key={priority}
                            type="button"
                            size="sm"
                            variant="outline"
                            className={field.value === priority ? "bg-hypnotic-accent text-white" : ""}
                            onClick={() => field.onChange(priority)}
                          >
                            {field.value === priority && <Check className="h-3 w-3 mr-1" />}
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsNewTaskModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-hypnotic-accent hover:bg-hypnotic-accent/90">
                  Create Task
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTaskBoard;
