
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import ReservationForm from './ReservationForm';
import { Plus, CalendarDays, List } from 'lucide-react';

// Mock reservation data
const mockReservations = [
  {
    id: 1,
    guestName: 'John Smith',
    email: 'john@example.com',
    phone: '+1 555-123-4567',
    adults: 2,
    children: 0,
    checkIn: '2023-10-15',
    checkOut: '2023-10-20',
    villaId: null,
    status: 'unassigned',
    hasPets: false,
    specialRequests: 'Early check-in if possible',
    paymentStatus: 'awaiting'
  },
  {
    id: 2,
    guestName: 'Maria Garcia',
    email: 'maria@example.com',
    phone: '+1 555-987-6543',
    adults: 2,
    children: 2,
    checkIn: '2023-10-18',
    checkOut: '2023-10-25',
    villaId: 3,
    status: 'assigned',
    hasPets: true,
    specialRequests: 'Pet-friendly accommodation needed',
    paymentStatus: 'confirmed'
  },
  {
    id: 3,
    guestName: 'David Wong',
    email: 'david@example.com',
    phone: '+1 555-456-7890',
    adults: 4,
    children: 0,
    checkIn: '2023-10-20',
    checkOut: '2023-10-27',
    villaId: 5,
    status: 'assigned',
    hasPets: false,
    specialRequests: '',
    paymentStatus: 'awaiting'
  }
];

type ReservationStatus = 'unassigned' | 'assigned' | 'awaiting' | 'confirmed';
type ViewMode = 'list' | 'calendar';

const AdminReservations = () => {
  const [activeStatus, setActiveStatus] = useState<ReservationStatus>('unassigned');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const filteredReservations = mockReservations.filter(res => {
    if (activeStatus === 'unassigned') return res.villaId === null;
    if (activeStatus === 'assigned') return res.villaId !== null;
    if (activeStatus === 'awaiting') return res.paymentStatus === 'awaiting';
    if (activeStatus === 'confirmed') return res.paymentStatus === 'confirmed';
    return true;
  });

  const handleOpenAssignModal = (reservation: any) => {
    setSelectedReservation(reservation);
    setIsAssignModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light">Reservation Management</h2>
        <div className="flex gap-4">
          <div className="border border-hypnotic-gray/30 rounded-md flex">
            <Button 
              variant="ghost" 
              onClick={() => setViewMode('list')}
              className={`rounded-r-none ${viewMode === 'list' ? 'bg-hypnotic-gray/20' : ''}`}
            >
              <List size={18} />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setViewMode('calendar')}
              className={`rounded-l-none ${viewMode === 'calendar' ? 'bg-hypnotic-gray/20' : ''}`}
            >
              <CalendarDays size={18} />
            </Button>
          </div>
          <Button
            className="bg-hypnotic-accent hover:bg-hypnotic-accent/90 flex items-center gap-2"
            onClick={() => setIsNewReservationOpen(true)}
          >
            <Plus size={16} />
            New Reservation
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value as ReservationStatus)}>
            <TabsList className="bg-hypnotic-darker mb-6">
              <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="awaiting">Awaiting Payment</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeStatus} className="mt-0">
              <div className="bg-hypnotic-darker rounded-md p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Villa</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map(reservation => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reservation.guestName}</div>
                            <div className="text-sm text-hypnotic-gray">{reservation.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{reservation.checkIn}</TableCell>
                        <TableCell>{reservation.checkOut}</TableCell>
                        <TableCell>
                          {reservation.villaId ? `Villa #${reservation.villaId}` : 'Not assigned'}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            reservation.paymentStatus === 'confirmed' 
                              ? 'bg-green-900/30 text-green-300' 
                              : 'bg-amber-900/30 text-amber-300'
                          }`}>
                            {reservation.paymentStatus === 'confirmed' ? 'Confirmed' : 'Awaiting'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenAssignModal(reservation)}
                            className="border-hypnotic-accent text-hypnotic-accent hover:bg-hypnotic-accent/10"
                          >
                            {reservation.villaId ? 'Reassign' : 'Assign'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredReservations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-hypnotic-gray">
                          No reservations found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="bg-hypnotic-darker rounded-md p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-3 pointer-events-auto mx-auto"
          />
          <div className="mt-6 p-4 border border-hypnotic-gray/20 rounded-md">
            <h3 className="text-lg font-medium mb-4">Reservations on {date?.toLocaleDateString()}</h3>
            {mockReservations.filter(r => r.checkIn === '2023-10-20' || r.checkOut === '2023-10-20').length > 0 ? (
              mockReservations.filter(r => r.checkIn === '2023-10-20' || r.checkOut === '2023-10-20').map(r => (
                <div key={r.id} className="mb-4 p-3 bg-hypnotic-dark/50 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{r.guestName}</div>
                      <div className="text-sm text-hypnotic-gray">Villa #{r.villaId || 'Unassigned'}</div>
                    </div>
                    <div>
                      {r.checkIn === '2023-10-20' ? (
                        <span className="text-green-300 text-sm">Check In</span>
                      ) : (
                        <span className="text-amber-300 text-sm">Check Out</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-hypnotic-gray text-center">No reservations for this date</p>
            )}
          </div>
        </div>
      )}

      {/* New Reservation Modal */}
      <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
        <DialogContent className="max-w-3xl bg-hypnotic-darker text-white border-hypnotic-gray/30">
          <DialogHeader>
            <DialogTitle>Create New Reservation</DialogTitle>
          </DialogHeader>
          <ReservationForm onClose={() => setIsNewReservationOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Assign Villa Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="bg-hypnotic-darker text-white border-hypnotic-gray/30">
          <DialogHeader>
            <DialogTitle>Assign Villa to Reservation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map(id => (
                <button
                  key={id}
                  className="p-4 border border-hypnotic-gray/30 rounded-md hover:bg-hypnotic-accent/20 transition-colors"
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  <h4 className="font-medium">Villa #{id}</h4>
                  <p className="text-sm text-hypnotic-gray">Available for selected dates</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReservations;
