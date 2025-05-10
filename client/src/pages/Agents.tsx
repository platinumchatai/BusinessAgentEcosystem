import { useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { agents, AgentType, phases } from "@/data/agents";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgentCard = ({ agent }: { agent: AgentType }) => {
  // Get phase color
  const getPhaseColor = (phase: number) => {
    switch (phase) {
      case 1:
        return "border-blue-500 shadow-blue-100";
      case 2:
        return "border-green-500 shadow-green-100"; // Keep green only for Phase 2
      case 3:
        return "border-amber-500 shadow-amber-100";
      case 4:
        return "border-purple-500 shadow-purple-100";
      default:
        return "border-gray-300";
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Strategy":
        return "bg-blue-100 text-blue-700";
      case "Marketing":
        return "bg-amber-100 text-amber-700";
      case "Finance":
        return "bg-blue-100 text-blue-700"; // Changed from green to blue
      case "Product":
        return "bg-purple-100 text-purple-700";
      case "Content":
        return "bg-indigo-100 text-indigo-700"; // Changed from emerald to indigo
      case "Customer":
        return "bg-cyan-100 text-cyan-700";
      case "Data":
        return "bg-amber-100 text-amber-700"; // Changed to amber
      case "Automation":
        return "bg-indigo-100 text-indigo-700";
      case "Coordinator":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/agent/${agent.id}`}>
        <Card className={cn(
          "h-full cursor-pointer hover:shadow-md transition-all bg-white rounded-xl",
          agent.coordinator ? `border-l-4 ${getPhaseColor(agent.phase)}` : ""
        )}>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-semibold text-gray-800">{agent.name}</CardTitle>
              <Badge className={cn(
                "rounded-full px-2 py-1 text-xs font-medium",
                getCategoryColor(agent.category)
              )}>
                {agent.coordinator ? "Coordinator" : agent.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardDescription className="text-gray-600 mb-4 line-clamp-3">
              {agent.description}
            </CardDescription>
            <div className="text-sm text-gray-500">
              <span className="inline-block mr-2">
                Phase {agent.phase}: {phases.find(p => p.id === agent.phase)?.name}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {agent.expertise.slice(0, 2).map((exp, i) => (
                <Badge key={i} variant="outline" className="font-normal text-xs">
                  {exp}
                </Badge>
              ))}
              {agent.expertise.length > 2 && (
                <Badge variant="outline" className="font-normal text-xs">
                  +{agent.expertise.length - 2} more
                </Badge>
              )}
            </div>
            <Button className="bg-primary text-white rounded-full w-8 h-8 p-0">
              <span className="sr-only">View Agent</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePhase, setActivePhase] = useState<number | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  
  // Filter agents based on search term, phase, and category
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === "" || 
                          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPhase = activePhase === "all" || agent.phase === activePhase;
    const matchesCategory = categoryFilter === "all" || agent.category === categoryFilter;
    
    return matchesSearch && matchesPhase && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(agents.map(agent => agent.category)));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1e4388] to-[#2a549e] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Agent Ecosystem</h1>
              <p className="text-lg mb-8 text-gray-100">
                Explore our specialized AI agents designed to support every stage of your business journey
              </p>
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="text"
                  placeholder="Search for agents by name, category, or expertise..."
                  className="pl-10 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300 focus:ring-white/30 focus:border-white/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Agents Content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Browse by Business Phase</h2>
                <TabsList className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                    onClick={() => setActivePhase("all")}
                  >
                    All Phases
                  </TabsTrigger>
                  {phases.map((phase) => (
                    <TabsTrigger 
                      key={phase.id} 
                      value={phase.id.toString()}
                      className={cn(
                        phase.id === 1 ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white" :
                        phase.id === 2 ? "data-[state=active]:bg-green-600 data-[state=active]:text-white" :
                        phase.id === 3 ? "data-[state=active]:bg-amber-500 data-[state=active]:text-white" :
                        "data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                      )}
                      onClick={() => setActivePhase(phase.id)}
                    >
                      {phase.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter by Category</h2>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={categoryFilter === "all" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setCategoryFilter("all")}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button 
                      key={category} 
                      variant={categoryFilter === category ? "default" : "outline"}
                      className={cn(
                        "rounded-full",
                        categoryFilter === category && (
                          category === "Strategy" ? "bg-blue-600 hover:bg-blue-700" :
                          category === "Marketing" ? "bg-amber-500 hover:bg-amber-600" :
                          category === "Finance" ? "bg-blue-600 hover:bg-blue-700" : // Changed from green to blue
                          category === "Product" ? "bg-purple-600 hover:bg-purple-700" :
                          category === "Content" ? "bg-indigo-600 hover:bg-indigo-700" : // Changed from emerald to indigo
                          category === "Customer" ? "bg-cyan-600 hover:bg-cyan-700" :
                          category === "Data" ? "bg-amber-500 hover:bg-amber-600" : // Changed to amber
                          category === "Automation" ? "bg-indigo-600 hover:bg-indigo-700" :
                          category === "Coordinator" ? "bg-blue-600 hover:bg-blue-700" :
                          "bg-gray-600 hover:bg-gray-700"
                        )
                      )}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
                
                {filteredAgents.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No agents found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                )}
              </TabsContent>
              
              {phases.map((phase) => (
                <TabsContent key={phase.id} value={phase.id.toString()} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents
                      .filter(agent => agent.phase === phase.id)
                      .map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                      ))}
                  </div>
                  
                  {filteredAgents.filter(agent => agent.phase === phase.id).length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium text-gray-800 mb-2">No agents found in this phase</h3>
                      <p className="text-gray-600">Try adjusting your search or category filters</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Begin your journey with our AI agents and transform your business strategy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consultation">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                  Start Consultation
                </Button>
              </Link>
              <Link href="/subscribe">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AgentsPage;