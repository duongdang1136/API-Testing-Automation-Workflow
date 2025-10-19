import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  Code2, 
  CheckCircle2, 
  Sparkles, 
  FileCode, 
  AlertCircle,
  ChevronRight,
  List,
  Play
} from 'lucide-react';
import { APISpecification, TestRequirement, TestScript } from '../types/models';
import { extractTestRequirements, generateTestScript } from '../utils/aiSimulator';

interface ScriptGenerationStepProps {
  apiSpec: APISpecification;
  onComplete: (testScripts: TestScript[], requirements: TestRequirement[]) => void;
}

export function ScriptGenerationStep({ apiSpec, onComplete }: ScriptGenerationStepProps) {
  const [requirements, setRequirements] = useState<TestRequirement[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<Set<string>>(new Set());
  const [testScripts, setTestScripts] = useState<TestScript[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'typescript'>('javascript');
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  useEffect(() => {
    // Auto-extract requirements when component mounts
    setIsExtracting(true);
    setTimeout(() => {
      const extracted = extractTestRequirements(apiSpec);
      setRequirements(extracted);
      // Auto-select all requirements
      setSelectedRequirements(new Set(extracted.map(r => r.id)));
      setIsExtracting(false);
      setExtractionComplete(true);
    }, 2000);
  }, [apiSpec]);

  const handleGenerateScripts = () => {
    setIsGenerating(true);
    const selectedReqs = requirements.filter(r => selectedRequirements.has(r.id));
    
    // Simulate AI generation delay
    setTimeout(() => {
      const scripts = selectedReqs.map(req => generateTestScript(req, apiSpec, language));
      setTestScripts(scripts);
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 3000);
  };

  const handleContinue = () => {
    onComplete(testScripts, requirements);
  };

  const toggleRequirement = (reqId: string) => {
    const newSelected = new Set(selectedRequirements);
    if (newSelected.has(reqId)) {
      newSelected.delete(reqId);
    } else {
      newSelected.add(reqId);
    }
    setSelectedRequirements(newSelected);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'happy': return 'bg-green-100 text-green-700 border-green-200';
      case 'exception': return 'bg-red-100 text-red-700 border-red-200';
      case 'validation': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'business-rule': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Code2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-blue-900 mb-2">Step 2: Generate API Test Scripts</h2>
          <p className="text-gray-600">
            AI extracts test requirements and generates detailed test scripts with mock data and validations
          </p>
        </div>
      </div>

      {/* Extraction Status */}
      {isExtracting && (
        <Alert className="border-blue-200 bg-blue-50">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <AlertDescription className="text-blue-800">
            AI is analyzing API specification and extracting test requirements...
          </AlertDescription>
        </Alert>
      )}

      {extractionComplete && !isExtracting && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Successfully extracted {requirements.length} test requirements from API specification
          </AlertDescription>
        </Alert>
      )}

      {/* Requirements List */}
      {requirements.length > 0 && (
        <Card className="p-6 border-blue-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-blue-600" />
              <h3 className="text-blue-900">Extracted Test Requirements</h3>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {selectedRequirements.size} selected
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript (Postman)</SelectItem>
                  <SelectItem value="typescript">TypeScript (Playwright)</SelectItem>
                  <SelectItem value="python">Python (pytest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {requirements.map((req) => (
              <div
                key={req.id}
                className={`border rounded-lg p-4 transition-all ${
                  selectedRequirements.has(req.id)
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedRequirements.has(req.id)}
                    onCheckedChange={() => toggleRequirement(req.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{req.title}</h4>
                        <p className="text-sm text-gray-600">{req.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge className={getPriorityColor(req.priority)}>
                          {req.priority}
                        </Badge>
                        <Badge className={getTestTypeColor(req.testType)}>
                          {req.testType}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Test Criteria:</p>
                      <ul className="space-y-1">
                        {req.criteria.map((criterion, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Select requirements to generate test scripts
            </p>
            <Button
              onClick={handleGenerateScripts}
              disabled={selectedRequirements.size === 0 || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Generating Scripts...
                </>
              ) : (
                <>
                  <FileCode className="w-4 h-4 mr-2" />
                  Generate Test Scripts ({selectedRequirements.size})
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Generation Status */}
      {isGenerating && (
        <Alert className="border-blue-200 bg-blue-50">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <AlertDescription className="text-blue-800">
            AI is generating detailed test scripts with mock data, assertions, and step-by-step validation logic...
          </AlertDescription>
        </Alert>
      )}

      {generationComplete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Successfully generated {testScripts.length} test scripts ready for execution and export
          </AlertDescription>
        </Alert>
      )}

      {/* Generated Scripts */}
      {testScripts.length > 0 && (
        <Card className="p-6 border-blue-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-900">Generated Test Scripts</h3>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {testScripts.length} scripts
            </Badge>
          </div>

          <Tabs defaultValue={testScripts[0]?.id} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-gray-100">
              {testScripts.map((script) => (
                <TabsTrigger key={script.id} value={script.id} className="whitespace-nowrap">
                  {script.title.substring(0, 40)}...
                </TabsTrigger>
              ))}
            </TabsList>

            {testScripts.map((script) => (
              <TabsContent key={script.id} value={script.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900 mb-1">{script.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        {script.language}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {script.framework}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Play className="w-4 h-4 mr-2" />
                    Run Test
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Test Steps:</p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <ol className="space-y-2">
                        {script.steps.map((step) => (
                          <li key={step.order} className="text-sm">
                            <div className="flex items-start gap-2">
                              <Badge className="bg-blue-600 text-white text-xs px-2">
                                {step.order}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-gray-900">{step.action}</p>
                                {step.assertion && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    ✓ {step.assertion}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mock Data:</p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(script.mockData, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Generated Code:</p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                      <code>{script.code}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      )}

      {testScripts.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue to Export
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
