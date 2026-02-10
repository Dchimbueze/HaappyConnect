
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

type VerificationStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function VerificationStep({ onNext, onPrev }: VerificationStepProps) {
  return (
    <div className="space-y-6">
        <p className="text-muted-foreground">To ensure quality, we ask experts to provide some proof of their expertise. This will not be shown on your public profile.</p>
        <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
            <Input id="linkedin" placeholder="https://linkedin.com/in/your-profile" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio or Personal Website</Label>
            <Input id="portfolio" placeholder="https://your-website.com" />
        </div>
        <div className="space-y-2">
            <Label>Upload Resume or CV</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div> 
        </div>
        <div className="flex justify-between">
            <Button variant="outline" onClick={onPrev}>
            Back
            </Button>
            <Button onClick={onNext}>Next</Button>
        </div>
    </div>
  );
}
