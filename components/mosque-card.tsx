'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MosqueProps {
  id: string;
  name: string;
  address: string;
  iftarTime?: string;
  tags?: string[];
  imageUrl?: string;
}

export function MosqueCard({ id, name, address, iftarTime, tags, imageUrl }: MosqueProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-900 to-blue-900 text-white h-full flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-slate-200 mb-4">{address}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {iftarTime && (
            <Badge variant="secondary" className="bg-blue-700 hover:bg-blue-600">
              Iftar: {iftarTime}
            </Badge>
          )}
          {tags && tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="border-slate-500 text-slate-200">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-blue-700 hover:bg-blue-600">
          <Link href={`/mosques/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}