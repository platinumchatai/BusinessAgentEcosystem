import { Router } from 'express';
import { analyzeConsultation } from './consultation-analyzer-fixed';
import { z } from 'zod';

const router = Router();

// Validation schema for consultation text
const consultationSchema = z.object({
  text: z.string().min(20, "Consultation text must be at least 20 characters long")
});

/**
 * POST /api/consultation/analyze
 * Analyzes consultation text and returns insights
 */
router.post('/analyze', async (req, res) => {
  try {
    // Validate request body
    const validationResult = consultationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: validationResult.error.format()
      });
    }
    
    const { text } = validationResult.data;
    
    // Analyze the consultation text
    const analysisResults = await analyzeConsultation(text);
    
    // Return the analysis results
    return res.status(200).json(analysisResults);
    
  } catch (error) {
    console.error('Error in consultation analysis endpoint:', error);
    return res.status(500).json({
      error: "Failed to analyze consultation",
      message: (error as Error).message
    });
  }
});

export default router;