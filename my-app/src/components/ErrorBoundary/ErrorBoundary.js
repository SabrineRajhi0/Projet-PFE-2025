import React from 'react';
import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-blueGray-700">Oops!</h1>
        <p className="text-lg text-blueGray-600 mb-4">Une erreur s'est produite.</p>
        <p className="text-sm text-blueGray-500">{error.message}</p>
      </div>
    </div>
  );
}