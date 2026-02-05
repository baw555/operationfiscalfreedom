import { useState } from "react";
import { HelpCircle, CheckCircle, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";

interface FieldHint {
  field: string;
  label: string;
  hint: string;
  required?: boolean;
  examples?: string[];
  validation?: string;
}

interface FormAssistantProps {
  formId: string;
  fields: FieldHint[];
  title?: string;
}

export function FormAssistant({ formId, fields, title = "Form Help" }: FormAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden" data-testid={`form-assistant-${formId}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-blue-100 transition-colors"
        data-testid="form-assistant-toggle"
      >
        <div className="flex items-center gap-2 text-[#1A365D]">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <span className="font-bold">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-blue-200 p-4 space-y-3">
          {fields.map((field) => (
            <div 
              key={field.field}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              data-testid={`field-hint-${field.field}`}
            >
              <button
                onClick={() => setExpandedField(expandedField === field.field ? null : field.field)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-800">{field.label}</span>
                  {field.required && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                      Required
                    </span>
                  )}
                </div>
                {expandedField === field.field ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedField === field.field && (
                <div className="px-3 pb-3 space-y-2 text-sm">
                  <p className="text-gray-600">{field.hint}</p>
                  
                  {field.examples && field.examples.length > 0 && (
                    <div className="bg-green-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-green-700 font-medium mb-1">
                        <CheckCircle className="w-3 h-3" />
                        Examples:
                      </div>
                      <ul className="list-disc list-inside text-gray-600 text-xs">
                        {field.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {field.validation && (
                    <div className="bg-yellow-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-yellow-700 font-medium mb-1">
                        <AlertCircle className="w-3 h-3" />
                        Format:
                      </div>
                      <p className="text-gray-600 text-xs">{field.validation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function InlineFieldHelp({ hint, className = "" }: { hint: string; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-blue-500 hover:text-blue-700 transition-colors"
        data-testid="inline-help-trigger"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1A365D] text-white text-xs rounded-lg shadow-xl animate-fade-in">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A365D] rotate-45"></div>
          {hint}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateX(-50%) translateY(4px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}

export const vaClaimFields: FieldHint[] = [
  {
    field: "condition",
    label: "Claimed Condition",
    hint: "The medical condition or disability you're claiming is connected to your military service.",
    required: true,
    examples: ["PTSD", "Tinnitus", "Lower back strain", "Sleep apnea"],
    validation: "Be specific about the condition name as it appears in medical records"
  },
  {
    field: "serviceConnection",
    label: "Service Connection",
    hint: "Explain how this condition is related to your military service. Include dates, locations, and incidents.",
    required: true,
    examples: [
      "Developed hearing loss during deployment in Iraq (2010-2011) due to IED explosions",
      "Injured knee during PT at Fort Bragg in March 2015"
    ]
  },
  {
    field: "currentSeverity",
    label: "Current Severity",
    hint: "Describe how this condition affects your daily life and work ability right now.",
    examples: [
      "Constant ringing makes it hard to hear conversations",
      "Cannot walk for more than 10 minutes without pain"
    ]
  },
  {
    field: "medicalEvidence",
    label: "Medical Evidence",
    hint: "List any medical records, doctor visits, or treatments you have for this condition.",
    examples: [
      "VA hospital records from 2020-2023",
      "Private physician diagnosis from Dr. Smith, dated Jan 2022"
    ]
  }
];

export const taxCreditFields: FieldHint[] = [
  {
    field: "employeeName",
    label: "Veteran Employee Name",
    hint: "Full legal name of the veteran employee you're claiming the tax credit for.",
    required: true
  },
  {
    field: "serviceVerification",
    label: "Service Verification",
    hint: "Documentation proving the employee's veteran status (DD-214, VA letter, etc.).",
    required: true,
    examples: ["DD-214 copy", "VA Benefits Summary Letter"]
  },
  {
    field: "hireDate",
    label: "Date of Hire",
    hint: "The date the veteran employee started working at your company.",
    required: true,
    validation: "Must be within the last 12 months for WOTC eligibility"
  },
  {
    field: "hoursWorked",
    label: "Hours Worked",
    hint: "Total hours the veteran has worked or is expected to work in the first year.",
    examples: ["400+ hours = $2,400 credit", "120-400 hours = $1,500 credit"],
    validation: "Minimum 120 hours required for any credit"
  }
];
