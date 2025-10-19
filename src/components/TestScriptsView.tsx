import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  CheckCircle2,
  Download,
  Eye,
  Copy,
  Code2,
  FileJson,
  Loader2,
} from 'lucide-react';
import { TestScript, PostmanCollection } from '../types/models';
import { toast } from 'sonner@2.0.3';

interface TestScriptsViewProps {
  testScripts: TestScript[];
  postmanCollection?: PostmanCollection;
  onGenerateJSON: () => void;
  isGenerating?: boolean;
}

export function TestScriptsView({
  testScripts,
  postmanCollection,
  onGenerateJSON,
  isGenerating = false,
}: TestScriptsViewProps) {
  const [selectedScript, setSelectedScript] = useState(testScripts[0] || null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success('Code copied to clipboard!');
      })
      .catch((err) => {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success('Code copied to clipboard!');
        } catch (e) {
          toast.error('Failed to copy code. Please copy manually.');
        }
        document.body.removeChild(textArea);
      });
  };

  const handleDownloadJSON = () => {
    if (!postmanCollection) return;

    const dataStr = JSON.stringify(postmanCollection, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${postmanCollection.info.name.replace(/\s+/g, '_')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('JSON file downloaded successfully!');
  };

  const handleViewJSON = () => {
    if (!postmanCollection) return;
    const dataStr = JSON.stringify(postmanCollection, null, 2);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<pre>' + dataStr + '</pre>');
      newWindow.document.title = 'Postman Collection JSON';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          Successfully generated {testScripts.length} test script{testScripts.length !== 1 ? 's' : ''}!
          {postmanCollection
            ? ' Postman collection is ready for download.'
            : ' Click "Generate JSON" to create Postman collection.'}
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-cyan-900">Generated Test Scripts</h3>
          <p className="text-sm text-gray-600">
            {testScripts.length} test script{testScripts.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <div className="flex items-center gap-3">
          {postmanCollection ? (
            <>
              <Button
                onClick={handleViewJSON}
                variant="outline"
                className="border-cyan-300 text-cyan-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View JSON
              </Button>
              <Button
                onClick={handleDownloadJSON}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
            </>
          ) : (
            <Button
              onClick={onGenerateJSON}
              disabled={isGenerating}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating JSON...
                </>
              ) : (
                <>
                  <FileJson className="w-4 h-4 mr-2" />
                  Generate JSON
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Scripts Display */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Script List */}
        <div className="col-span-4">
          <Card className="border-cyan-200">
            <div className="p-4 border-b border-cyan-200 bg-cyan-50">
              <h4 className="text-cyan-900">Test Scripts</h4>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="p-3 space-y-2">
                {testScripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => setSelectedScript(script)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedScript?.id === script.id
                        ? 'border-cyan-400 bg-cyan-50'
                        : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm line-clamp-2">{script.title}</p>
                      <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 flex-shrink-0">
                        {script.language}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{script.framework}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right: Script Details */}
        <div className="col-span-8">
          {selectedScript ? (
            <Card className="border-cyan-200">
              <div className="p-4 border-b border-cyan-200 bg-cyan-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-cyan-900 mb-1">{selectedScript.title}</h4>
                    <p className="text-sm text-gray-600">{selectedScript.description}</p>
                  </div>
                  <Button
                    onClick={() => handleCopyCode(selectedScript.code)}
                    variant="outline"
                    size="sm"
                    className="border-cyan-300 text-cyan-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="code" className="w-full">
                <div className="border-b border-cyan-200 px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="code" className="data-[state=active]:border-cyan-600">
                      <Code2 className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="steps" className="data-[state=active]:border-cyan-600">
                      Steps
                    </TabsTrigger>
                    <TabsTrigger value="mockdata" className="data-[state=active]:border-cyan-600">
                      Mock Data
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="code" className="p-0 m-0">
                  <ScrollArea className="h-[550px]">
                    <pre className="p-4 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
                      <code>{selectedScript.code}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="steps" className="p-4 m-0">
                  <ScrollArea className="h-[550px]">
                    <div className="space-y-4">
                      {selectedScript.steps.map((step) => (
                        <div key={step.order} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                            {step.order}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-1">{step.action}</p>
                            {step.input && (
                              <p className="text-xs text-gray-600">
                                Input: {typeof step.input === 'string' ? step.input : JSON.stringify(step.input)}
                              </p>
                            )}
                            {step.expectedOutput && (
                              <p className="text-xs text-gray-600">
                                Expected: {typeof step.expectedOutput === 'string' ? step.expectedOutput : JSON.stringify(step.expectedOutput)}
                              </p>
                            )}
                            {step.assertion && (
                              <p className="text-xs text-cyan-700 mt-1">
                                ✓ {step.assertion}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="mockdata" className="p-4 m-0">
                  <ScrollArea className="h-[550px]">
                    <pre className="text-sm bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
                      <code>{JSON.stringify(selectedScript.mockData, null, 2)}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card className="border-cyan-200 h-[650px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a script to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* JSON Preview (if generated) */}
      {postmanCollection && (
        <Card className="border-cyan-200">
          <div className="p-4 border-b border-cyan-200 bg-cyan-50">
            <h4 className="text-cyan-900">Postman Collection JSON</h4>
            <p className="text-sm text-gray-600">Ready to import into Postman</p>
          </div>
          <ScrollArea className="h-[300px]">
            <pre className="p-4 text-xs bg-gray-900 text-gray-100 overflow-x-auto">
              <code>{JSON.stringify(postmanCollection, null, 2)}</code>
            </pre>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
