import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { FileText, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { APISpecification } from '../types/models';
import { sampleAPISpecs } from '../data/sampleData';

interface RequirementCollectionStepProps {
  onComplete: (apiSpec: APISpecification, additionalInfo: string) => void;
}

export function RequirementCollectionStep({ onComplete }: RequirementCollectionStepProps) {
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [customSpec, setCustomSpec] = useState<Partial<APISpecification>>({
    name: '',
    endpoint: '',
    method: 'POST',
    description: '',
    fields: [],
    statusCodes: [],
    businessRules: [],
  });
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setProcessing(true);

    setTimeout(() => {
      const apiSpec = useTemplate
        ? sampleAPISpecs.find(spec => spec.id === selectedSpec)!
        : customSpec as APISpecification;

      setShowSuccess(true);

      setTimeout(() => {
        onComplete(apiSpec, additionalInfo);
      }, 1000);
    }, 1500);
  };

  const isValid = useTemplate ? selectedSpec !== '' : customSpec.name !== '';

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-blue-900 mb-2">Step 1: Thu thập yêu cầu kiểm thử cụ thể</h2>
          <p className="text-gray-600">
            BA cung cấp định nghĩa chuẩn của API (fields, datatype, status code, business rules, happy/exception cases)
          </p>
        </div>
      </div>

      <Card className="p-6 border-blue-200 bg-white shadow-sm">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={useTemplate ? 'default' : 'outline'}
              onClick={() => setUseTemplate(true)}
              className={useTemplate ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Use Sample API Spec
            </Button>
            <Button
              variant={!useTemplate ? 'default' : 'outline'}
              onClick={() => setUseTemplate(false)}
              className={!useTemplate ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Create Custom Spec
            </Button>
          </div>

          {useTemplate ? (
            <div className="space-y-4">
              <div>
                <Label>Select API Specification</Label>
                <Select value={selectedSpec} onValueChange={setSelectedSpec}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Choose an API specification..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleAPISpecs.map(spec => (
                      <SelectItem key={spec.id} value={spec.id}>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            {spec.method}
                          </Badge>
                          <span>{spec.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSpec && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  {(() => {
                    const spec = sampleAPISpecs.find(s => s.id === selectedSpec);
                    return spec ? (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-blue-600 text-white">{spec.method}</Badge>
                              <code className="text-sm bg-white px-2 py-1 rounded border border-blue-200">
                                {spec.endpoint}
                              </code>
                            </div>
                            <p className="text-sm text-gray-700">{spec.description}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600 mb-2">Fields ({spec.fields.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {spec.fields.map(field => (
                              <Badge key={field.name} variant="outline" className="bg-white text-xs">
                                {field.name}
                                {field.required && <span className="text-red-500">*</span>}
                                <span className="text-gray-500 ml-1">: {field.dataType}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600 mb-2">Status Codes:</p>
                          <div className="flex flex-wrap gap-2">
                            {spec.statusCodes.map(status => (
                              <Badge
                                key={status.code}
                                className={
                                  status.code < 300 ? 'bg-green-100 text-green-700 border-green-200' :
                                  status.code < 400 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                  'bg-red-100 text-red-700 border-red-200'
                                }
                              >
                                {status.code} - {status.description}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-600 mb-2">Business Rules ({spec.businessRules.length}):</p>
                          <ul className="text-sm space-y-1">
                            {spec.businessRules.slice(0, 3).map((rule, idx) => (
                              <li key={idx} className="text-gray-700 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{rule}</span>
                              </li>
                            ))}
                            {spec.businessRules.length > 3 && (
                              <li className="text-gray-500 text-xs">+ {spec.businessRules.length - 3} more rules...</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>API Name</Label>
                  <Input
                    placeholder="e.g., User Login API"
                    value={customSpec.name}
                    onChange={(e) => setCustomSpec({ ...customSpec, name: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <Label>Endpoint</Label>
                  <Input
                    placeholder="e.g., /api/v1/auth/login"
                    value={customSpec.endpoint}
                    onChange={(e) => setCustomSpec({ ...customSpec, endpoint: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label>Method</Label>
                <Select
                  value={customSpec.method}
                  onValueChange={(value: any) => setCustomSpec({ ...customSpec, method: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the API functionality..."
                  value={customSpec.description}
                  onChange={(e) => setCustomSpec({ ...customSpec, description: e.target.value })}
                  className="border-gray-300 min-h-20"
                />
              </div>
            </div>
          )}

          <div>
            <Label>Additional Information (Optional)</Label>
            <Textarea
              placeholder="Add Swagger/OpenAPI spec, user flow diagram, or any additional context..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="border-gray-300 min-h-24"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>You can also upload Swagger/OpenAPI JSON files or user flow diagrams for complex scenarios</span>
          </div>
        </div>
      </Card>

      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            API specification collected successfully! Proceeding to requirement extraction...
          </AlertDescription>
        </Alert>
      )}

      {processing && !showSuccess && (
        <Alert className="border-blue-200 bg-blue-50">
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <AlertDescription className="text-blue-800">
            AI is analyzing your API specification and preparing requirements...
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || processing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {processing ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Extract Requirements with AI
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
