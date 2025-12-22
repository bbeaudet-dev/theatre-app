import { Mail, Phone, Github, Linkedin, MapPin, Globe } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { PrintButton } from "../../components/PrintButton"

export default function Resume() {
  return (
    <div className="min-h-screen print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto print:max-w-none print:w-[8.5in] resume-zoom">
        {/* Print Button */}
        <div className="flex justify-end mb-4 px-8 print:hidden">
          <PrintButton />
        </div>
        
        <Card className="shadow-lg print:shadow-none print:rounded-none print:border-0">
        <CardContent className="p-8 print:p-4">

          {/* Header Section */}
          <div className="mb-2 no-break avoid-break-after">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Benjamin Michael Beaudet</h1>
              <h2 className="text-lg text-muted-foreground">Software & Mechanical Engineer</h2>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-sm no-break avoid-break-after">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <a href="mailto:bbeaudet0@gmail.com" className="hover:underline">
                bbeaudet0@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <a href="tel:+12489776340" className="hover:underline">
                (248) 977-6340
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <a href="https://benbeaudet.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Website & Portfolio (benbeaudet.com)
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              <a
                href="https://github.com/bbeaudet-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Github (bbeaudet-dev)
              </a>
            </div>
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <a
                href="https://linkedin.com/in/ben-beaudet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Linkedin (ben-beaudet)
              </a>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Columbus OH  /  Brooklyn NY</span>
            </div>
          </div>

          {/* Experience */}
          <section className="mb-2 print:break-inside-avoid avoid-break-before">
            <h3 className="text-lg font-semibold mb-1">Professional Experience</h3>

            {/* BATS-TOI */}
            <div className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-medium">Fullstack & Firmware Engineer</h4>
                  <span className="text-muted-foreground">@</span>
                  <h5 className="text-muted-foreground">BATS-TOI</h5>
                </div>
                <div className="whitespace-nowrap"><span className="text-muted-foreground text-xs opacity-80">Contract</span> <span className="text-muted-foreground text-sm">· Nov 2025 - Present</span></div>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm resume-bullets">
                <li>Fullstack and firmware engineering work</li>
              </ul>
            </div>

            {/* Fractal Tech */}
            <div className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-medium">Software Engineer</h4>
                  <span className="text-muted-foreground">@</span>
                  <h5 className="text-muted-foreground">Fractal Tech</h5>
                </div>
                <div className="whitespace-nowrap"><span className="text-muted-foreground text-xs opacity-80">Brooklyn, NY</span> <span className="text-muted-foreground text-sm">· Jun - Aug 2025</span></div>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm resume-bullets">
                <li>Built and deployed 20 full-stack apps, including an AI-powered smart mirror, interactive mobile puzzle game, image analysis and algorithm visualization tool, and AI riddle chatbot</li>
                <li>Ripped 933 GitHub commits and 239 PRs with 800+ hours of hands-on-keys over 12 weeks</li>
              </ul>
            </div>

            {/* Cerelog */}
            <div className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-medium">Firmware Engineer</h4>
                  <span className="text-muted-foreground">@</span>
                  <h5 className="text-muted-foreground">Cerelog</h5>
                </div>
                <div className="whitespace-nowrap"><span className="text-muted-foreground text-xs opacity-80">Brooklyn, NY</span> <span className="text-muted-foreground text-sm">· Jun - Jul 2025</span></div>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm resume-bullets">
                <li>Implemented serial handshake protocol, Brainflow SDK integration, runtime-configurable board parameters, and O(n) ring buffer algorithm for robust and reliable EEG data transmission using an ESP32 microcontroller and ADS1299 ADC</li>                
              </ul>
            </div>

            {/* Progress Rail */}
            <div className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-medium">Design Engineer</h4>
                  <span className="text-muted-foreground">@</span>
                  <h5 className="text-muted-foreground">Progress Rail (Caterpillar)</h5>
                </div>
                <div className="whitespace-nowrap"><span className="text-muted-foreground text-xs opacity-80">Cleveland, OH</span> <span className="text-muted-foreground text-sm">· Sep 2023 - Mar 2025</span></div>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm resume-bullets">
                  <li>Created 400+ special trackwork drawings and BOMs to fulfill 300+ sales orders for 75 global agencies, resulting in $3.5M in revenue</li>
                  <li>Developed CAD programs with 7,500+ lines of VBA code to automate switch point and joint bar design, savings 3,000+ engineering hours annually</li>
              </ul>
            </div>

            {/* Lazurite */}
            <div className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-medium">Product Engineer</h4>
                  <span className="text-muted-foreground">@</span>
                  <h5 className="text-muted-foreground">Lazurite</h5>
                </div>
                <div className="whitespace-nowrap"><span className="text-muted-foreground text-xs opacity-80">Cleveland, OH</span> <span className="text-muted-foreground text-sm">· Apr 2022 - Jun 2023</span></div>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm resume-bullets">
                <li>Designed and manufactured 10 portable kits for surgical device demonstration and established an inventory system tracking 150+ electronic and mechanical components</li>
                <li>Created a cost-per-case analysis demonstrating cost-savings over alternatives and oversaw manufacturing of first 10 production units</li>
              </ul>
            </div>
            
            {/* Birkdale */}
            <div className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-medium">Design Engineer</h4>
                  <span className="text-muted-foreground">@</span>
                  <h5 className="text-muted-foreground">Birkdale Neuro Rehab Centre</h5>
                </div>
                <div className="whitespace-nowrap"><span className="text-muted-foreground text-xs opacity-80">London, UK</span> <span className="text-muted-foreground text-sm">· Summer 2019</span></div>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm resume-bullets">
                  <li>Designed an innovative medical therapy device with Bluetooth, pressure sensors, haptic feedback, and 3D-printed handgrips, utilizing programmable device ouputs and mirror therapy to improve patient recovery and engagement</li>
              </ul>
            </div>
          </section>

          {/* Technical Skills */}
          <section className="mb-4 print:break-inside-avoid avoid-break-before">
            <h3 className="text-lg font-semibold mb-1">Technical Skills</h3>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h5 className="mr-2">Languages:</h5>
                <Badge variant="skill">JavaScript/Typescript</Badge>
                <Badge variant="skill">Python</Badge>
                <Badge variant="skill">C/C++</Badge>
                <Badge variant="skill">VBA</Badge>
                <Badge variant="skill">MATLAB</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h5 className="mr-2">Fullstack:</h5>
                <Badge variant="skill">React</Badge>
                <Badge variant="skill">Next.js</Badge>
                <Badge variant="skill">Node.js</Badge>
                <Badge variant="skill">Express</Badge>
                <Badge variant="skill">PostgreSQL</Badge>
                <Badge variant="skill">Supabase</Badge>
                <Badge variant="skill">OpenAI API</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h5 className="mr-2">Hardware:</h5>
                <Badge variant="skill">Arduino</Badge>
                <Badge variant="skill">Raspberry Pi</Badge>
                <Badge variant="skill">Linux</Badge>
                <Badge variant="skill">Serial Protocols (SPI, I2C)</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h5 className="mr-2">Tools & Infra:</h5>
                <Badge variant="skill">Git</Badge>
                <Badge variant="skill">Docker</Badge>
                <Badge variant="skill">Cursor</Badge>
                <Badge variant="skill">Claude Code</Badge>
                  <Badge variant="skill">Vercel (AI SDK)</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 ">
                <h5 className="mr-2">CAD:</h5>
                <Badge variant="skill">Autodesk Inventor</Badge>
                <Badge variant="skill">Fusion</Badge>
                <Badge variant="skill">SolidWorks</Badge>
                <Badge variant="skill">AutoCAD 2D</Badge>
              </div>
            </div>
          </section>


          {/* Education + Ask me about (2 columns) */}
          <section className="mb-4 print:break-inside-avoid avoid-break-before grid grid-cols-1 md:grid-cols-7 print:grid-cols-7 gap-2">
            <div className="md:col-span-4 print:col-span-4">
              <h3 className="text-lg font-semibold mb-1">Education</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0mb-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h4 className="font-medium">Master of Science</h4>
                      <span className="text-muted-foreground text-sm">· Innovation & Entrepreneurship</span>
                    </div>
                    <div className="text-muted-foreground text-sm whitespace-nowrap">John Carroll University · 2020-2021 · GPA: 3.52</div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0 mb-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h4 className="font-medium">Bachelor of Science</h4>
                      <span className="text-muted-foreground text-sm">· Mechanical Engineering</span>
                    </div>
                    <div className="text-muted-foreground text-sm whitespace-nowrap">Miami University · 2016-2020 · GPA: 3.68</div>
                  </div>
                  <div className="text-muted-foreground text-sm">Mathematics Minor · Cum Laude</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 print:col-span-3 pl-4">
              <h3 className="text-lg font-semibold mb-1">Ask me about…</h3>
              <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                <li>building a smart mirror in 10 days</li>
                <li>modeling aircraft wing instability</li>
                <li>my Venture For America Fellowship</li>
                <li>solving diabolical Sudoku puzzles</li>
                <li>Broadway shows</li>
              </ul>
            </div>
          </section>
            
        </CardContent>
      </Card>
      </div>
    </div>
  )
} 