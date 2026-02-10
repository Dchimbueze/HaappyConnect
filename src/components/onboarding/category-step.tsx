
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

type CategoryStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const popularSkills = ['React', 'Fundraising', 'UI/UX Design', 'Node.js', 'SEO', 'Venture Capital', 'Figma', 'AWS'];

export default function CategoryStep({ onNext, onPrev }: CategoryStepProps) {
  const [skills, setSkills] = useState<string[]>(['React']);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !skills.includes(s) && skills.length < 10) {
      setSkills([...skills, s]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(sk => sk !== skill));
  };


  return (
    <div className="space-y-6">
        <p className="text-muted-foreground">Help seekers find you by defining your area of expertise.</p>
        <div className="space-y-2">
            <Label htmlFor="category">Primary Category</Label>
            <Select>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="software-development">Software Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="coaching">Coaching</SelectItem>
                </SelectContent>
            </Select>
        </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <p className="text-sm text-muted-foreground">Add up to 10 skills that best describe your expertise.</p>
        <div className="flex flex-wrap gap-2 rounded-md border min-h-12 p-2">
            {skills.map(skill => (
                <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-2 rounded-full hover:bg-background/50 p-0.5">
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
        </div>
        <div className="flex gap-2">
            <Input 
                id="skills" 
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillInput);
                    }
                }}
            />
            <Button variant="outline" onClick={() => addSkill(skillInput)}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-muted-foreground pt-1 pr-2">Suggestions:</span>
            {popularSkills.filter(s => !skills.includes(s)).map(skill => (
                 <Button key={skill} size="sm" variant="outline" onClick={() => addSkill(skill)}>+ {skill}</Button>
            ))}
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
