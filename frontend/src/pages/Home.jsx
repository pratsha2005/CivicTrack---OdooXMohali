import React from 'react'
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard';
import { ReportForm } from '../components/ReportForm';
import { IssueDetail } from '../components/IssueDetail';

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Dashboard />
      <ReportForm />
      <IssueDetail />
    </div>
  );
}