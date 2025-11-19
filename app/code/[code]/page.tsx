'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Link as LinkType } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Copy, BarChart3, Calendar, MousePointerClick } from 'lucide-react';
import Link from 'next/link';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [link, setLink] = useState<LinkType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shortUrl = `${baseUrl}/${code}`;

  useEffect(() => {
    fetchLink();
  }, [code]);

  const fetchLink = async () => {
    try {
      const response = await fetch(`/api/links/${code}`);
      if (response.ok) {
        const data = await response.json();
        setLink(data);
      } else if (response.status === 404) {
        setError('Link not found');
      } else {
        setError('Failed to fetch link details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <div className="pt-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="pt-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Link Statistics</h1>
          </div>
          <p className="text-slate-600">Detailed analytics for your shortened URL</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Short Link Details</CardTitle>
            <CardDescription>Information about this shortened URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Short Code</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-mono font-semibold text-slate-900 bg-slate-100 px-4 py-3 rounded border border-slate-200">
                  {link.code}
                </code>
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-slate-500">{shortUrl}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Target URL</label>
              <div className="flex items-center gap-2 p-4 bg-slate-50 rounded border border-slate-200">
                <ExternalLink className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a
                  href={link.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-700 hover:text-slate-900 hover:underline break-all"
                >
                  {link.target_url}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Clicks</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{link.click_count}</p>
                </div>
                <MousePointerClick className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Created</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2">
                    {new Date(link.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(link.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Last Clicked</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2">
                    {link.last_clicked_at
                      ? new Date(link.last_clicked_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Never'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              {link.last_clicked_at && (
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(link.last_clicked_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" onClick={() => window.open(shortUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Link
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Short URL
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
