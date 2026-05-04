import { BlipRel, GlobalRel, HttpMethod } from './rel-enums';
import { z } from 'astro:content';

/**
 * Schema for a relationship definition
 */
export const RelSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  description: z.string()
});

/**
 * Schema for the relationships API response
 */
export const RelsApiSchema = z.object({
  rels: z.record(z.string(), RelSchema),
  generated: z.string()
});

/**
 * Type for a relationship definition
 */
export type Rel = {
  method: HttpMethod;
  description: string;
};

/**
 * Map of all relationships with their metadata
 */
export const RelsMap = {
  // Blip relationships
  [BlipRel.Self]: { 
    method: "GET" as HttpMethod, 
    description: "Link to this blip resource" 
  },
  [BlipRel.Html]: { 
    method: "GET" as HttpMethod, 
    description: "Human readable view of the blip" 
  },
  [BlipRel.Quadrant]: { 
    method: "GET" as HttpMethod, 
    description: "Link to related quadrant resource" 
  },
  
  // Global relationships (using different string keys to avoid conflicts)
  [GlobalRel.Self]: { 
    method: "GET" as HttpMethod, 
    description: "Link to this API resource (blips index)" 
  },
  [GlobalRel.Quadrants]: { 
    method: "GET" as HttpMethod, 
    description: "List of all quadrants" 
  },
  [GlobalRel.Blips]: { 
    method: "GET" as HttpMethod, 
    description: "List of all blips" 
  },
  [GlobalRel.Rings]: { 
    method: "GET" as HttpMethod, 
    description: "List of all rings" 
  },
  [GlobalRel.Rels]: { 
    method: "GET" as HttpMethod, 
    description: "Documentation for all available relationships" 
  },
  [GlobalRel.Problems]: { 
    method: "GET" as HttpMethod, 
    description: "Documentation for all possible error types" 
  },
  [GlobalRel.Home]: { 
    method: "GET" as HttpMethod, 
    description: "Website home" 
  }
} as const;
