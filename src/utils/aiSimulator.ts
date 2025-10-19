import { APISpecification, TestRequirement, TestScript, PostmanCollection } from '../types/models';

// Simulates AI-powered test requirement generation from user description
export async function generateTestRequirements(description: string): Promise<TestRequirement[]> {
  const requirements: TestRequirement[] = [];
  const timestamp = new Date().toISOString();
  
  // Parse the description to extract API details
  const hasLogin = description.toLowerCase().includes('login');
  const hasRegister = description.toLowerCase().includes('register') || description.toLowerCase().includes('signup');
  const hasAuth = description.toLowerCase().includes('auth');
  const hasCart = description.toLowerCase().includes('cart');
  const hasPayment = description.toLowerCase().includes('payment') || description.toLowerCase().includes('subscribe');
  
  // Generate happy path requirement
  requirements.push({
    id: `req-${Date.now()}-1`,
    specId: `spec-${Date.now()}`,
    title: 'Verify successful API request with valid data',
    description: 'Test that the API returns success when all required fields are provided with valid values',
    testType: 'happy',
    priority: 'high',
    criteria: [
      'Verify all required fields are provided with valid values',
      'Verify response status code is 200 or 201',
      'Verify response contains all expected fields',
      'Verify response time is within acceptable limits (< 2000ms)',
      'Verify response data matches expected format',
    ],
    generatedAt: timestamp,
  });

  // Generate validation requirements
  requirements.push({
    id: `req-${Date.now()}-2`,
    specId: `spec-${Date.now()}`,
    title: 'Validate required fields are enforced',
    description: 'Test that missing required fields result in proper validation errors',
    testType: 'validation',
    priority: 'high',
    criteria: [
      'Verify request fails when required fields are missing',
      'Verify response status code is 400 (Bad Request)',
      'Verify error message clearly indicates which field is missing',
      'Verify error response includes field name and validation rule',
    ],
    generatedAt: timestamp,
  });

  // Generate data type validation
  requirements.push({
    id: `req-${Date.now()}-3`,
    specId: `spec-${Date.now()}`,
    title: 'Validate field data types',
    description: 'Test that incorrect data types are properly rejected',
    testType: 'validation',
    priority: 'medium',
    criteria: [
      'Verify string fields reject non-string values',
      'Verify numeric fields reject non-numeric values',
      'Verify email fields validate email format',
      'Verify date fields validate date format',
      'Verify appropriate error messages for type mismatches',
    ],
    generatedAt: timestamp,
  });

  // Context-specific requirements
  if (hasLogin || hasAuth) {
    requirements.push({
      id: `req-${Date.now()}-4`,
      specId: `spec-${Date.now()}`,
      title: 'Test invalid credentials handling',
      description: 'Verify that invalid username/password combinations are properly rejected',
      testType: 'exception',
      priority: 'high',
      criteria: [
        'Verify response status code is 401 (Unauthorized)',
        'Verify error message does not reveal which field is incorrect',
        'Verify no session token is returned',
        'Verify failed attempt is logged',
      ],
      generatedAt: timestamp,
    });

    requirements.push({
      id: `req-${Date.now()}-5`,
      specId: `spec-${Date.now()}`,
      title: 'Test rate limiting after failed attempts',
      description: 'Verify account protection after multiple failed login attempts',
      testType: 'business-rule',
      priority: 'high',
      criteria: [
        'Perform multiple failed login attempts',
        'Verify account is locked after threshold (e.g., 5 attempts)',
        'Verify response status code is 429 (Too Many Requests)',
        'Verify lockout period is enforced',
        'Verify successful login after lockout period expires',
      ],
      generatedAt: timestamp,
    });
  }

  if (hasRegister) {
    requirements.push({
      id: `req-${Date.now()}-6`,
      specId: `spec-${Date.now()}`,
      title: 'Test duplicate email prevention',
      description: 'Verify that duplicate email addresses are not allowed',
      testType: 'exception',
      priority: 'high',
      criteria: [
        'Attempt to register with existing email address',
        'Verify response status code is 409 (Conflict)',
        'Verify error message indicates email already exists',
        'Verify no duplicate account is created',
      ],
      generatedAt: timestamp,
    });

    requirements.push({
      id: `req-${Date.now()}-7`,
      specId: `spec-${Date.now()}`,
      title: 'Test password complexity requirements',
      description: 'Verify password meets security complexity requirements',
      testType: 'validation',
      priority: 'medium',
      criteria: [
        'Verify minimum password length is enforced',
        'Verify password requires mix of characters (uppercase, lowercase, numbers)',
        'Verify special character requirement if applicable',
        'Verify weak/common passwords are rejected',
        'Verify appropriate error messages for each rule violation',
      ],
      generatedAt: timestamp,
    });
  }

  if (hasCart) {
    requirements.push({
      id: `req-${Date.now()}-8`,
      specId: `spec-${Date.now()}`,
      title: 'Test inventory availability check',
      description: 'Verify that items can only be added if in stock',
      testType: 'business-rule',
      priority: 'high',
      criteria: [
        'Attempt to add out-of-stock item to cart',
        'Verify response indicates item unavailable',
        'Verify cart is not updated',
        'Verify inventory count is accurate',
      ],
      generatedAt: timestamp,
    });

    requirements.push({
      id: `req-${Date.now()}-9`,
      specId: `spec-${Date.now()}`,
      title: 'Test quantity validation',
      description: 'Verify quantity must be positive and within limits',
      testType: 'validation',
      priority: 'medium',
      criteria: [
        'Verify negative quantities are rejected',
        'Verify zero quantity is rejected',
        'Verify quantity exceeding stock is rejected',
        'Verify maximum quantity limits are enforced',
      ],
      generatedAt: timestamp,
    });
  }

  if (hasPayment) {
    requirements.push({
      id: `req-${Date.now()}-10`,
      specId: `spec-${Date.now()}`,
      title: 'Test payment gateway integration',
      description: 'Verify payment processing with valid payment method',
      testType: 'happy',
      priority: 'high',
      criteria: [
        'Verify payment gateway connection is established',
        'Verify payment amount matches order total',
        'Verify payment method is validated',
        'Verify transaction ID is returned',
        'Verify payment status is updated correctly',
      ],
      generatedAt: timestamp,
    });

    requirements.push({
      id: `req-${Date.now()}-11`,
      specId: `spec-${Date.now()}`,
      title: 'Test payment failure handling',
      description: 'Verify proper handling when payment is declined',
      testType: 'exception',
      priority: 'high',
      criteria: [
        'Simulate payment gateway decline',
        'Verify response status code is 402 (Payment Required)',
        'Verify error message is user-friendly',
        'Verify order status remains unpaid',
        'Verify no charges are made',
      ],
      generatedAt: timestamp,
    });
  }

  // Always add boundary and performance tests
  requirements.push({
    id: `req-${Date.now()}-12`,
    specId: `spec-${Date.now()}`,
    title: 'Test boundary values',
    description: 'Verify system handles edge cases for numeric and string fields',
    testType: 'validation',
    priority: 'medium',
    criteria: [
      'Test with minimum allowed values',
      'Test with maximum allowed values',
      'Test with values just below minimum',
      'Test with values just above maximum',
      'Verify appropriate error messages for out-of-range values',
    ],
    generatedAt: timestamp,
  });

  requirements.push({
    id: `req-${Date.now()}-13`,
    specId: `spec-${Date.now()}`,
    title: 'Test API performance under load',
    description: 'Verify API response time meets performance requirements',
    testType: 'business-rule',
    priority: 'medium',
    criteria: [
      'Verify response time < 2000ms for normal requests',
      'Verify response time < 5000ms under high load',
      'Verify no timeout errors occur',
      'Verify concurrent requests are handled properly',
    ],
    generatedAt: timestamp,
  });

  return requirements;
}

// Simulates AI-powered requirement extraction
export function extractTestRequirements(apiSpec: APISpecification): TestRequirement[] {
  const requirements: TestRequirement[] = [];
  const timestamp = new Date().toISOString();

  // Generate happy path tests
  requirements.push({
    id: `req-${Date.now()}-1`,
    specId: apiSpec.id,
    title: `Verify successful ${apiSpec.method} request to ${apiSpec.endpoint}`,
    description: `Test that ${apiSpec.name} returns success with valid input data`,
    testType: 'happy',
    priority: 'high',
    criteria: [
      'Verify all required fields are provided with valid values',
      `Verify response status code is ${apiSpec.statusCodes.find(s => s.code < 300)?.code || 200}`,
      'Verify response structure matches expected schema',
      'Verify response time is within acceptable limits (< 2s)',
    ],
    generatedAt: timestamp,
  });

  // Generate validation tests for each field
  apiSpec.fields.filter(f => f.required).forEach((field, index) => {
    requirements.push({
      id: `req-${Date.now()}-${index + 2}`,
      specId: apiSpec.id,
      title: `Validate required field: ${field.name}`,
      description: `Test that ${field.name} field validation works correctly`,
      testType: 'validation',
      priority: 'medium',
      criteria: [
        `Verify request fails when ${field.name} is missing`,
        `Verify request fails when ${field.name} has invalid ${field.dataType} format`,
        field.validation ? `Verify ${field.validation} is enforced` : '',
        'Verify error message clearly indicates validation failure',
      ].filter(Boolean),
      generatedAt: timestamp,
    });
  });

  // Generate exception tests from status codes
  apiSpec.statusCodes.filter(s => s.code >= 400).forEach((statusCode, index) => {
    requirements.push({
      id: `req-${Date.now()}-${100 + index}`,
      specId: apiSpec.id,
      title: `Test ${statusCode.code} - ${statusCode.description}`,
      description: statusCode.scenario,
      testType: 'exception',
      priority: statusCode.code >= 500 ? 'high' : 'medium',
      criteria: [
        `Verify response status code is ${statusCode.code}`,
        'Verify error response contains appropriate error message',
        'Verify error response includes error code/type',
        'Verify no data corruption occurs',
      ],
      generatedAt: timestamp,
    });
  });

  // Generate business rule tests
  apiSpec.businessRules.forEach((rule, index) => {
    requirements.push({
      id: `req-${Date.now()}-${200 + index}`,
      specId: apiSpec.id,
      title: `Verify business rule: ${rule.substring(0, 50)}...`,
      description: rule,
      testType: 'business-rule',
      priority: 'high',
      criteria: [
        `Verify ${rule}`,
        'Verify appropriate error when rule is violated',
        'Verify rule enforcement is consistent',
      ],
      generatedAt: timestamp,
    });
  });

  return requirements;
}

// Simulates AI-powered test script generation
export function generateTestScript(
  requirement: TestRequirement,
  apiSpec: APISpecification,
  language: 'javascript' | 'python' | 'typescript' = 'javascript'
): TestScript {
  const timestamp = new Date().toISOString();

  if (language === 'javascript') {
    return generateJavaScriptTestScript(requirement, apiSpec, timestamp);
  } else if (language === 'python') {
    return generatePythonTestScript(requirement, apiSpec, timestamp);
  } else {
    return generateTypeScriptTestScript(requirement, apiSpec, timestamp);
  }
}

function generateJavaScriptTestScript(
  requirement: TestRequirement,
  apiSpec: APISpecification,
  timestamp: string
): TestScript {
  const mockData = generateMockData(apiSpec);
  
  let code = `// Test: ${requirement.title}\n`;
  code += `// Generated at: ${timestamp}\n\n`;
  code += `pm.test("${requirement.title}", function () {\n`;
  
  if (requirement.testType === 'happy') {
    code += `    const requestBody = ${JSON.stringify(mockData.request, null, 8)};\n\n`;
    code += `    pm.sendRequest({\n`;
    code += `        url: pm.environment.get("baseUrl") + "${apiSpec.endpoint}",\n`;
    code += `        method: "${apiSpec.method}",\n`;
    code += `        header: { "Content-Type": "application/json" },\n`;
    code += `        body: { mode: "raw", raw: JSON.stringify(requestBody) }\n`;
    code += `    }, function (err, response) {\n`;
    code += `        pm.expect(err).to.be.null;\n`;
    code += `        pm.expect(response.code).to.equal(${apiSpec.statusCodes[0]?.code || 200});\n`;
    code += `        \n`;
    code += `        const jsonData = response.json();\n`;
    apiSpec.fields.slice(0, 3).forEach(field => {
      code += `        pm.expect(jsonData).to.have.property("${field.name}");\n`;
    });
    code += `    });\n`;
  } else if (requirement.testType === 'validation' || requirement.testType === 'exception') {
    code += `    const invalidRequestBody = ${JSON.stringify(mockData.invalidRequest, null, 8)};\n\n`;
    code += `    pm.sendRequest({\n`;
    code += `        url: pm.environment.get("baseUrl") + "${apiSpec.endpoint}",\n`;
    code += `        method: "${apiSpec.method}",\n`;
    code += `        header: { "Content-Type": "application/json" },\n`;
    code += `        body: { mode: "raw", raw: JSON.stringify(invalidRequestBody) }\n`;
    code += `    }, function (err, response) {\n`;
    const errorCode = apiSpec.statusCodes.find(s => s.code >= 400)?.code || 400;
    code += `        pm.expect(response.code).to.equal(${errorCode});\n`;
    code += `        \n`;
    code += `        const jsonData = response.json();\n`;
    code += `        pm.expect(jsonData).to.have.property("error");\n`;
    code += `        pm.expect(jsonData.error).to.have.property("message");\n`;
    code += `    });\n`;
  }
  
  code += `});`;

  return {
    id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requirementId: requirement.id,
    title: requirement.title,
    description: requirement.description,
    language: 'javascript',
    framework: 'Postman/Newman',
    code,
    steps: generateTestSteps(requirement, apiSpec),
    mockData,
    generatedAt: timestamp,
  };
}

function generatePythonTestScript(
  requirement: TestRequirement,
  apiSpec: APISpecification,
  timestamp: string
): TestScript {
  const mockData = generateMockData(apiSpec);
  
  let code = `# Test: ${requirement.title}\n`;
  code += `# Generated at: ${timestamp}\n\n`;
  code += `import requests\nimport pytest\n\n`;
  code += `def test_${requirement.id.replace(/-/g, '_')}():\n`;
  code += `    base_url = "http://localhost:3000"\n`;
  code += `    endpoint = "${apiSpec.endpoint}"\n\n`;
  
  if (requirement.testType === 'happy') {
    code += `    payload = ${JSON.stringify(mockData.request, null, 4).replace(/"/g, "'")}\n\n`;
    code += `    response = requests.${apiSpec.method.toLowerCase()}(f"{base_url}{endpoint}", json=payload)\n\n`;
    code += `    assert response.status_code == ${apiSpec.statusCodes[0]?.code || 200}\n`;
    code += `    data = response.json()\n`;
    apiSpec.fields.slice(0, 3).forEach(field => {
      code += `    assert "${field.name}" in data\n`;
    });
  } else {
    code += `    invalid_payload = ${JSON.stringify(mockData.invalidRequest, null, 4).replace(/"/g, "'")}\n\n`;
    code += `    response = requests.${apiSpec.method.toLowerCase()}(f"{base_url}{endpoint}", json=invalid_payload)\n\n`;
    const errorCode = apiSpec.statusCodes.find(s => s.code >= 400)?.code || 400;
    code += `    assert response.status_code == ${errorCode}\n`;
    code += `    data = response.json()\n`;
    code += `    assert "error" in data\n`;
  }

  return {
    id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requirementId: requirement.id,
    title: requirement.title,
    description: requirement.description,
    language: 'python',
    framework: 'pytest + requests',
    code,
    steps: generateTestSteps(requirement, apiSpec),
    mockData,
    generatedAt: timestamp,
  };
}

function generateTypeScriptTestScript(
  requirement: TestRequirement,
  apiSpec: APISpecification,
  timestamp: string
): TestScript {
  const mockData = generateMockData(apiSpec);
  
  let code = `// Test: ${requirement.title}\n`;
  code += `// Generated at: ${timestamp}\n\n`;
  code += `import { test, expect } from '@playwright/test';\n\n`;
  code += `test('${requirement.title}', async ({ request }) => {\n`;
  code += `    const baseUrl = 'http://localhost:3000';\n`;
  code += `    const endpoint = '${apiSpec.endpoint}';\n\n`;
  
  if (requirement.testType === 'happy') {
    code += `    const payload = ${JSON.stringify(mockData.request, null, 4)};\n\n`;
    code += `    const response = await request.${apiSpec.method.toLowerCase()}(\`\${baseUrl}\${endpoint}\`, {\n`;
    code += `        data: payload,\n`;
    code += `        headers: { 'Content-Type': 'application/json' }\n`;
    code += `    });\n\n`;
    code += `    expect(response.status()).toBe(${apiSpec.statusCodes[0]?.code || 200});\n`;
    code += `    const data = await response.json();\n`;
    apiSpec.fields.slice(0, 3).forEach(field => {
      code += `    expect(data).toHaveProperty('${field.name}');\n`;
    });
  } else {
    code += `    const invalidPayload = ${JSON.stringify(mockData.invalidRequest, null, 4)};\n\n`;
    code += `    const response = await request.${apiSpec.method.toLowerCase()}(\`\${baseUrl}\${endpoint}\`, {\n`;
    code += `        data: invalidPayload,\n`;
    code += `        headers: { 'Content-Type': 'application/json' }\n`;
    code += `    });\n\n`;
    const errorCode = apiSpec.statusCodes.find(s => s.code >= 400)?.code || 400;
    code += `    expect(response.status()).toBe(${errorCode});\n`;
    code += `    const data = await response.json();\n`;
    code += `    expect(data).toHaveProperty('error');\n`;
  }
  
  code += `});`;

  return {
    id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requirementId: requirement.id,
    title: requirement.title,
    description: requirement.description,
    language: 'typescript',
    framework: 'Playwright',
    code,
    steps: generateTestSteps(requirement, apiSpec),
    mockData,
    generatedAt: timestamp,
  };
}

function generateTestSteps(requirement: TestRequirement, apiSpec: APISpecification) {
  const steps = [
    {
      order: 1,
      action: 'Prepare test data',
      input: 'Mock data based on API specification',
    },
    {
      order: 2,
      action: `Send ${apiSpec.method} request to ${apiSpec.endpoint}`,
    },
    {
      order: 3,
      action: 'Verify response status code',
      assertion: `Status code should match expected value`,
    },
    {
      order: 4,
      action: 'Verify response structure',
      assertion: 'Response should contain all required fields',
    },
    {
      order: 5,
      action: 'Verify business logic',
      assertion: requirement.description,
    },
  ];

  return steps;
}

function generateMockData(apiSpec: APISpecification) {
  const request: any = {};
  const invalidRequest: any = {};

  apiSpec.fields.forEach(field => {
    if (field.example) {
      request[field.name] = field.example;
    } else {
      // Generate mock data based on data type
      switch (field.dataType.toLowerCase()) {
        case 'string':
          request[field.name] = field.validation?.includes('email') 
            ? 'test@example.com' 
            : `mock_${field.name}`;
          break;
        case 'number':
        case 'integer':
          request[field.name] = 123;
          break;
        case 'boolean':
          request[field.name] = true;
          break;
        case 'array':
          request[field.name] = [];
          break;
        case 'object':
          request[field.name] = {};
          break;
        default:
          request[field.name] = `mock_${field.name}`;
      }
    }

    // Create invalid version
    if (field.required) {
      invalidRequest[field.name] = null; // Missing required field
    } else {
      invalidRequest[field.name] = request[field.name];
    }
  });

  // Remove one required field for invalid request
  const requiredFields = apiSpec.fields.filter(f => f.required);
  if (requiredFields.length > 0) {
    delete invalidRequest[requiredFields[0].name];
  }

  return {
    request,
    invalidRequest,
    response: {
      ...request,
      id: `mock-id-${Date.now()}`,
      createdAt: new Date().toISOString(),
    },
  };
}

// Convert test scripts to Postman collection
export function convertToPostmanCollection(
  testScripts: TestScript[],
  apiSpec: APISpecification
): PostmanCollection {
  const collection: PostmanCollection = {
    info: {
      name: `${apiSpec.name} - Test Collection`,
      description: `Auto-generated test collection for ${apiSpec.name}\nGenerated at: ${new Date().toISOString()}`,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [],
    variable: [
      { key: 'baseUrl', value: 'http://localhost:3000', type: 'string' },
      { key: 'apiVersion', value: 'v1', type: 'string' },
    ],
  };

  testScripts.forEach(script => {
    const urlParts = apiSpec.endpoint.split('/').filter(p => p);
    
    collection.item.push({
      name: script.title,
      request: {
        method: apiSpec.method,
        header: [
          { key: 'Content-Type', value: 'application/json' },
        ],
        body: apiSpec.method !== 'GET' ? {
          mode: 'raw',
          raw: JSON.stringify(script.mockData?.request || {}, null, 2),
        } : undefined,
        url: {
          raw: `{{baseUrl}}${apiSpec.endpoint}`,
          host: ['{{baseUrl}}'],
          path: urlParts,
        },
      },
      event: [
        {
          listen: 'test',
          script: {
            type: 'text/javascript',
            exec: script.code.split('\n'),
          },
        },
      ],
      response: [],
    });
  });

  return collection;
}
