export interface FixRule {
  id: string;
  confidence: number;
  description: string;
  keywords: string[];
  apply: () => Promise<void>;
}

export interface FixRuleset {
  version: string;
  categories: Record<string, FixRule[]>;
}

export const FIX_RULESET: FixRuleset = {
  version: "1.0.0",
  categories: {
    UI_BROKEN: [
      {
        id: "ADD_ONCLICK_GUARD",
        confidence: 0.42,
        description: "Missing click handler guard",
        keywords: ["click", "handler", "onclick", "nothing happens"],
        apply: async () => {
          console.log("[FIX] Applied: ADD_ONCLICK_GUARD");
        }
      },
      {
        id: "STANDARDIZE_SHADCN_BUTTON",
        confidence: 0.35,
        description: "Normalize button to shadcn spec",
        keywords: ["button", "style", "shadcn", "component"],
        apply: async () => {
          console.log("[FIX] Applied: STANDARDIZE_SHADCN_BUTTON");
        }
      },
      {
        id: "FIX_RESPONSIVE_LAYOUT",
        confidence: 0.38,
        description: "Fix responsive layout breakpoints",
        keywords: ["responsive", "mobile", "breakpoint", "layout"],
        apply: async () => {
          console.log("[FIX] Applied: FIX_RESPONSIVE_LAYOUT");
        }
      }
    ],
    FORM_ERROR: [
      {
        id: "ADD_REQUIRED_VALIDATION",
        confidence: 0.55,
        description: "Add required field validation",
        keywords: ["required", "validation", "empty", "blank"],
        apply: async () => {
          console.log("[FIX] Applied: ADD_REQUIRED_VALIDATION");
        }
      },
      {
        id: "FIX_FORM_SUBMIT",
        confidence: 0.50,
        description: "Fix form submission handler",
        keywords: ["submit", "form", "not submitting"],
        apply: async () => {
          console.log("[FIX] Applied: FIX_FORM_SUBMIT");
        }
      },
      {
        id: "ADD_INPUT_SANITIZATION",
        confidence: 0.45,
        description: "Add input sanitization",
        keywords: ["input", "sanitize", "escape", "xss"],
        apply: async () => {
          console.log("[FIX] Applied: ADD_INPUT_SANITIZATION");
        }
      }
    ],
    API_FAIL: [
      {
        id: "WRAP_TRY_CATCH",
        confidence: 0.60,
        description: "Unhandled promise guard",
        keywords: ["unhandled", "promise", "async", "catch"],
        apply: async () => {
          console.log("[FIX] Applied: WRAP_TRY_CATCH");
        }
      },
      {
        id: "ADD_TIMEOUT_HANDLER",
        confidence: 0.52,
        description: "Add request timeout handling",
        keywords: ["timeout", "slow", "hanging"],
        apply: async () => {
          console.log("[FIX] Applied: ADD_TIMEOUT_HANDLER");
        }
      },
      {
        id: "FIX_CORS_CONFIG",
        confidence: 0.48,
        description: "Fix CORS configuration",
        keywords: ["cors", "cross-origin", "blocked"],
        apply: async () => {
          console.log("[FIX] Applied: FIX_CORS_CONFIG");
        }
      }
    ],
    RUNTIME_ERROR: [
      {
        id: "ADD_NULL_GUARD",
        confidence: 0.65,
        description: "Add null/undefined guard",
        keywords: ["null", "undefined", "cannot read", "property"],
        apply: async () => {
          console.log("[FIX] Applied: ADD_NULL_GUARD");
        }
      },
      {
        id: "FIX_TYPE_COERCION",
        confidence: 0.40,
        description: "Fix type coercion issue",
        keywords: ["type", "coercion", "nan", "number"],
        apply: async () => {
          console.log("[FIX] Applied: FIX_TYPE_COERCION");
        }
      }
    ]
  }
};

export function findMatchingRules(category: string, description: string): FixRule[] {
  const rules = FIX_RULESET.categories[category] || [];
  const lowerDesc = description.toLowerCase();
  
  return rules
    .filter(rule => rule.keywords.some(k => lowerDesc.includes(k)))
    .sort((a, b) => b.confidence - a.confidence);
}

export function getBestRule(category: string, description: string): FixRule | null {
  const matches = findMatchingRules(category, description);
  return matches.length > 0 ? matches[0] : null;
}

export function getRulesetVersion(): string {
  return FIX_RULESET.version;
}

export function getAllCategories(): string[] {
  return Object.keys(FIX_RULESET.categories);
}

export function getRulesForCategory(category: string): FixRule[] {
  return FIX_RULESET.categories[category] || [];
}
