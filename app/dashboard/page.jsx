import React from 'react'
import CreateForm from './_components/CreateForm'
import FormList from './_components/FormList'
function Dashboard() {
  return (
    <div >
      <h2 className='font-bold text-2xl flex items-center justify-between'>Dashboard
      <CreateForm></CreateForm>
      </h2>
      <FormList></FormList>
      
    </div>
  )
}

export default Dashboard
