// File: app/staff/checkin/_sections/ManualSearch.tsx
"use client";

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Search } from 'lucide-react';
import React, { useState } from 'react';

interface SearchResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  slot: string;
}

const ManualSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  // Check-in states
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [checkinStatus, setCheckinStatus] = useState<string | null>(null);
  const [checkinData, setCheckinData] = useState<any>(null);
  // Step & Error states
  const [step, setStep] = useState<'search' | 'result'>('search');
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setSelectedResult(null);
    setCheckinStatus(null);
    setCheckinData(null);
    setStep('search');
    setError(null);
  };

  const handleSearch = async () => {
    setHasSearched(true);
    try {
      const response = await fetch('/staff/api/manual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm }),
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleCheckin = async () => {
    if (!selectedResult) return;

    try {
      const response = await fetch('/staff/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedResult }),
      });

      const data = await response.json();
      if (response.ok) {
        setCheckinStatus(data.message);
        setCheckinData(data);
        setStep('result');
      } else {
        setError(data.error || 'An error occurred during check-in');
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      setError('An error occurred during check-in');
    }
  };


  const renderSearchStep = () => (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {searchResults.length > 0 && (
        <div>
          <RadioGroup value={selectedResult || ''} onValueChange={setSelectedResult}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>User Information</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Slot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <RadioGroupItem value={result.id} id={result.id} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Label htmlFor={result.id} className="font-semibold text-black">
                          {result.name}
                        </Label>
                        <p className="text-sm text-gray-500">{result.email}</p>
                        <p className="text-sm text-gray-500">{result.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{result.status}</TableCell>
                    <TableCell>{result.slot}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </RadioGroup>
          <Button onClick={handleCheckin} disabled={!selectedResult} className="mt-4">
            Check-in
          </Button>
        </div>
      )}
      {hasSearched && searchResults.length === 0 && !error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No results found. Please try a different search term.</AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderResultStep = () => (
    <div className="space-y-4">
      {error ? (
        <>
          <p className="text-red-500">{error}</p>
          <Button onClick={() => setStep('search')}>Try Again</Button>
        </>
      ) : checkinStatus ? (
        <>
          <p className="text-green-500">{checkinStatus}</p>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Name:</p>
            <p>{checkinData.name}</p>
            <p className="font-medium">Email:</p>
            <p>{checkinData.email}</p>
            <p className="font-medium">Phone:</p>
            <p>{checkinData.phone}</p>
          </div>
          <Button onClick={() => {
            resetState();
            setIsOpen(false);
          }}>
            Close
          </Button>
        </>
      ) : (
        <p>Processing check-in...</p>
      )}
    </div>
  );


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetState();
      }}
    >
      <DialogTrigger asChild>
        <div className="aspect-square w-full">
          <Button
            variant="outline"
            className="w-full h-full flex flex-col items-center justify-center border rounded bg-white hover:bg-black hover:text-white transition-colors duration-300"
          >
            <Search className="h-8 w-8 mb-2" />
            <span className="text-xs uppercase font-bold">Manual Search</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-2xl w-full">
          <DialogTitle className="text-lg font-bold mb-4">Manual Search</DialogTitle>
          <DialogDescription className="text-muted-foreground mb-4">
            {step === 'search' ? "Search for a user to check-in" : "Check-in result"}
          </DialogDescription>
          {step === 'search' ? renderSearchStep() : renderResultStep()}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ManualSearch;