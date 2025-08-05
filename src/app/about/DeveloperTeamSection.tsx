
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Github } from "lucide-react";

export default function DeveloperTeamSection() {
  return (
    <div className="space-y-10">
      <h3 className="text-3xl font-extrabold text-center text-foreground">
        Meet the Developer
      </h3>
      <div className="flex justify-center">
        <Card className="max-w-sm text-center bg-card/50">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src="https://avatars.githubusercontent.com/u/108912833?v=4" alt="Sudhanshu Gaikwad" />
              <AvatarFallback>SG</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">Sudhanshu Gaikwad</CardTitle>
            <p className="text-primary font-semibold">Full Stack Developer</p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sudhanshu is the creator of Kaizen Ai, driven by a passion for technology and a desire to help others succeed in their careers.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <a
                href="https://www.linkedin.com/in/sudhanshugaikwad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/sudhanshugaikwad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
