import { useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { agents, AgentType, phases } from "@/data/agents";
import { cn } from "@/lib/utils";
import MainLayout from "@/layouts/MainLayout";
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

const AgentCard = ({ agent }: { agent: AgentType }) => {
  // Get phase color
  const getPhaseColor = (phase: number) => {
    switch (phase) {
      case 1:
        return "border-blue-500";
      case 2:
        return "border-blue-600";
      case 3:
        return "border-amber-500";
      case 4:
        return "border-purple-500";
      default:
        return "border-gray-300";
    }
  };

  // Get category color - following a logical color scheme for badges
  const getCategoryColor = (category: string) => {
    switch (category) {
      // Business/Strategy categories - blue
      case "Strategy":
        return "bg-blue-100 text-blue-700";
      case "Coordinator":
        return "bg-blue-100 text-blue-700";
      
      // Marketing/Communication - orange/amber
      case "Marketing":
        return "bg-amber-100 text-amber-700";
      case "Content":
        return "bg-amber-100 text-amber-700";
        
      // Financial categories - blue (removed green)
      case "Finance":
        return "bg-blue-100 text-blue-700";
        
      // Product/Customer - purple
      case "Product":
        return "bg-purple-100 text-purple-700";
      case "Customer":
        return "bg-purple-100 text-purple-700";
      
      // Technical categories - indigo/blue
      case "Data":
        return "bg-indigo-100 text-indigo-700";
      case "Automation":
        return "bg-indigo-100 text-indigo-700";
        
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
    <MainLayout>
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
            <div className="w-full">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Browse by Business Phase</h2>
                <div className="relative p-1 bg-white rounded-full shadow-sm border border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-0">
                    <button 
                      className={cn(
                        "py-3 px-4 rounded-full text-sm font-medium transition-all duration-200",
                        activePhase === "all" 
                          ? "bg-[#1e4388] text-white shadow-md" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                      onClick={() => setActivePhase("all")}
                    >
                      All Phases
                    </button>
                    {phases.map((phase) => (
                      <button
                        key={phase.id}
                        className={cn(
                          "py-3 px-4 rounded-full text-sm font-medium transition-all duration-200",
                          activePhase === phase.id 
                            ? phase.id === 1 ? "bg-blue-600 text-white shadow-md" :
                              phase.id === 2 ? "bg-blue-700 text-white shadow-md" :
                              phase.id === 3 ? "bg-amber-500 text-white shadow-md" :
                              "bg-purple-600 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setActivePhase(phase.id)}
                      >
                        {phase.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter by Category</h2>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={categoryFilter === "all" ? "default" : "outline"}
                    className={cn(
                      "rounded-full",
                      categoryFilter === "all" ? "bg-[#1e4388] hover:bg-[#1e4388]/90" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    )}
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
                        categoryFilter === category ? (
                          // Business/Strategy categories - blue
                          (category === "Strategy" || category === "Coordinator" || category === "Finance") ? 
                            "bg-blue-600 hover:bg-blue-700" :
                          
                          // Marketing/Communication - orange/amber
                          (category === "Marketing" || category === "Content") ? 
                            "bg-amber-500 hover:bg-amber-600" :
                          
                          // Product/Customer - purple
                          (category === "Product" || category === "Customer") ? 
                            "bg-purple-600 hover:bg-purple-700" :
                          
                          // Technical categories - indigo
                          (category === "Data" || category === "Automation") ? 
                            "bg-indigo-600 hover:bg-indigo-700" :
                          
                          // Default
                          "bg-primary hover:bg-primary/90"
                        ) : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      )}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                {/* Display Coordinators first in a separate section */}
                {filteredAgents.some(agent => agent.coordinator) && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Coordinator Agents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAgents
                        .filter(agent => agent.coordinator)
                        .map((agent) => (
                          <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                  </div>
                )}
                
                {/* Display non-coordinator agents */}
                {filteredAgents.some(agent => !agent.coordinator) && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Specialized Agents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAgents
                        .filter(agent => !agent.coordinator)
                        .map((agent) => (
                          <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                  </div>
                )}
                
                {filteredAgents.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No agents found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
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
    </MainLayout>
  );
};

export default AgentsPage;