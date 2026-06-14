import React from 'react';
import CreateForm from './_components/CreateForm';
import FormList from './_components/FormList';

function Dashboard() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-display font-bold text-xl text-gray-900">My Forms</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage your forms</p>
        </div>
        <CreateForm />
      </div>
      <FormList />
    </div>
  );
}

export default Dashboard;
