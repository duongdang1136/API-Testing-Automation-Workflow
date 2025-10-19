import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Download, 
  CheckCircle2, 
  FileJson, 
  Sparkles,
  Copy,
  ExternalLink,
  Server,
  Eye
} from 'lucide-react';
import { APISpecification, TestScript, TestRequirement, PostmanCollection } from '../types/models';
import { convertToPostmanCollection } from '../utils/aiSimulator';

interface PostmanExportStepProps {
  apiSpec: APISpecification;
  testScripts: TestScript[];
  requirements: TestRequirement[];
}

export function PostmanExportStep({ apiSpec, testScripts, requirements }: PostmanExportStepProps) {
  const [postmanCollection, setPostmanCollection] = useState<PostmanCollection | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Auto-convert to Postman format
    setIsConverting(true);
    setTimeout(() => {
      const collection = convertToPostmanCollection(testScripts, apiSpec);
      setPostmanCollection(collection);
      setIsConverting(false);
      setConversionComplete(true);
    }, 2000);
  }, [testScripts, apiSpec]);

  const handleDownload = () => {
    if (!postmanCollection) return;

    const blob = new Blob([JSON.stringify(postmanCollection, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${apiSpec.name.replace(/\s+/g, '_')}_Postman_Collection.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    if (!postmanCollection) return;
    
    navigator.clipboard.writeText(JSON.stringify(postmanCollection, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMockServerInfo = () => {
    return {
      url: 'https://mockserver.example.com',
      apiKey: 'mock-api-key-' + Math.random().toString(36).substring(7),
      endpoints: testScripts.length,
      status: 'ready',
    };
  };

  const mockServer = getMockServerInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileJson className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-blue-900 mb-2">Step 3: Export to Postman Collection</h2>
          <p className="text-gray-600">
            Convert test scripts to Postman JSON format and configure mock server for API testing
          </p>
        </div>
      </div>

      {/* Conversion Status */}
      {isConverting && (
        <Alert className="border-blue-200 bg-blue-50">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <AlertDescription className="text-blue-800">
            Converting test scripts to Postman Collection JSON format...
          </AlertDescription>
        </Alert>
      )}

      {conversionComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Successfully converted {testScripts.length} test scripts to Postman Collection format
          </AlertDescription>
        </Alert>
      )}

      {/* Collection Summary */}
      {postmanCollection && (
        <Card className="p-6 border-blue-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-blue-900 mb-1">{postmanCollection.info.name}</h3>
              <p className="text-sm text-gray-600">{postmanCollection.info.description}</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Ready to Import
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Requests</p>
              <p className="text-2xl text-blue-900">{postmanCollection.item.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Test Scripts</p>
              <p className="text-2xl text-green-900">{testScripts.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Variables</p>
              <p className="text-2xl text-purple-900">{postmanCollection.variable?.length || 0}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Collection Variables:</p>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                {postmanCollection.variable?.map((variable) => (
                  <div key={variable.key} className="flex items-center gap-2 text-sm">
                    <code className="bg-white px-2 py-1 rounded border border-gray-300">
                      {variable.key}
                    </code>
                    <span className="text-gray-500">=</span>
                    <span className="text-gray-700">{variable.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Requests in Collection:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {postmanCollection.item.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={
                          item.request.method === 'GET' ? 'bg-blue-600 text-white' :
                          item.request.method === 'POST' ? 'bg-green-600 text-white' :
                          item.request.method === 'PUT' ? 'bg-yellow-600 text-white' :
                          item.request.method === 'DELETE' ? 'bg-red-600 text-white' :
                          'bg-gray-600 text-white'
                        }>
                          {item.request.method}
                        </Badge>
                        <span className="text-sm text-gray-900">{item.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.event?.length || 0} test scripts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Postman Collection
            </Button>
            <Button
              onClick={handleCopyJSON}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Mock Server Configuration */}
      {postmanCollection && (
        <Card className="p-6 border-purple-200 bg-purple-50 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-purple-600" />
            <h3 className="text-purple-900">Mock Server Configuration</h3>
            <Badge className="bg-purple-600 text-white">Optional</Badge>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Since the backend API is not yet implemented, you can use a mock server to simulate API responses based on your test specifications.
          </p>

          <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mock Server URL</p>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded border border-gray-300 inline-block mt-1">
                  {mockServer.url}
                </code>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {mockServer.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-600">API Key</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded border border-gray-300 inline-block mt-1">
                {mockServer.apiKey}
              </code>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-200">
              <p className="text-sm text-gray-600">
                {mockServer.endpoints} mock endpoints configured
              </p>
              <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                <Eye className="w-4 h-4 mr-2" />
                View Mock Responses
              </Button>
            </div>
          </div>

          <Alert className="mt-4 border-purple-300 bg-purple-100">
            <AlertDescription className="text-purple-900 text-sm">
              <strong>How to use:</strong> Import the downloaded collection into Postman, then update the baseUrl variable to point to the mock server URL above.
            </AlertDescription>
          </Alert>
        </Card>
      )}

      {/* JSON Preview */}
      {postmanCollection && (
        <Card className="p-6 border-blue-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-blue-600" />
              <h3 className="text-blue-900">Collection JSON Preview</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Postman
            </Button>
          </div>

          <Tabs defaultValue="formatted" className="w-full">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="formatted">Formatted View</TabsTrigger>
              <TabsTrigger value="raw">Raw JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="formatted" className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Collection Info:</p>
                    <div className="bg-white rounded p-3 border border-gray-300">
                      <p className="text-sm"><strong>Name:</strong> {postmanCollection.info.name}</p>
                      <p className="text-sm"><strong>Schema:</strong> {postmanCollection.info.schema}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Variables:</p>
                    <div className="bg-white rounded p-3 border border-gray-300">
                      {postmanCollection.variable?.map((v, idx) => (
                        <p key={idx} className="text-sm font-mono">
                          {v.key}: "{v.value}"
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Requests ({postmanCollection.item.length}):</p>
                    <div className="space-y-2">
                      {postmanCollection.item.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="bg-white rounded p-3 border border-gray-300 text-sm">
                          <p><strong>{item.name}</strong></p>
                          <p className="font-mono text-xs text-gray-600">
                            {item.request.method} {item.request.url.raw}
                          </p>
                        </div>
                      ))}
                      {postmanCollection.item.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          + {postmanCollection.item.length - 3} more requests
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="raw">
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-xs text-green-400">
                  <code>{JSON.stringify(postmanCollection, null, 2)}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {/* Next Steps */}
      {conversionComplete && (
        <Card className="p-6 border-blue-200 bg-blue-50 shadow-sm">
          <h3 className="text-blue-900 mb-3">Next Steps</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Download the Postman collection JSON file</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Open Postman and click "Import" in the top left</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Select the downloaded JSON file to import the collection</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Configure environment variables (baseUrl, apiKey, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Run the collection using Newman or Postman's Collection Runner</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>View detailed test results and generate reports</span>
            </li>
          </ol>
        </Card>
      )}
    </div>
  );
}
