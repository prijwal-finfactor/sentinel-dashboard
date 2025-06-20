import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Briefcase, Building, Clock } from 'lucide-react';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-fiu-gray-200 p-4">
      <div className="flex items-center space-x-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-fiu-primary text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-fiu-gray-900">{user.name}</h3>
          <p className="text-sm text-fiu-secondary">{user.role}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-fiu-secondary">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-fiu-secondary">
          <Building className="h-4 w-4" />
          <span>{user.department}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-fiu-secondary">
          <Clock className="h-4 w-4" />
          <span>Last active: {new Date(user.lastActivity).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}