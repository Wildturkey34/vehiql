import React from 'react'
import TestDrivesList from './_components/test-drive-list'

export const metadata ={
    title: "Test Drive | Vehiql",
    description: "Manage Test Drive Bookings"
}

const TestDrivePage = () => {
  return (
    <div>
        <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Drive Management</h1>
      <TestDrivesList />
    </div>
    </div>
  )
}

export default TestDrivePage
