import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskService {
  // Very simple placeholder risk logic for now
  assess(input: { severity?: number; durationHours?: number; redFlags?: boolean }): { level: 'Low' | 'Medium' | 'High' | 'Emergency'; factors: string[] } {
    const factors: string[] = [];
    let score = 0;
    if (input.severity && input.severity >= 7) {
      score += 2;
      factors.push('High severity');
    }
    if (input.durationHours && input.durationHours > 72) {
      score += 1;
      factors.push('Prolonged duration');
    }
    if (input.redFlags) {
      score += 3;
      factors.push('Red flags present');
    }

    let level: 'Low' | 'Medium' | 'High' | 'Emergency' = 'Low';
    if (score >= 4) level = 'High';
    if (score >= 6) level = 'Emergency';
    else if (score >= 2) level = 'Medium';

    return { level, factors };
  }
}
