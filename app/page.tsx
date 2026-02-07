'use client'

import Link from 'next/link'
import { FileText, Zap, Globe, MessageSquare, Clock, Shield, ArrowRight, Sparkles, Upload, Brain, Search, CheckCircle, ArrowRightCircle, Layers, Database, Cpu } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-black dark:text-white" />
              <span className="text-2xl font-bold text-black dark:text-white">
                DocuFlow
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-black dark:text-white hover:opacity-70 px-4 py-2 rounded-lg transition-opacity border border-gray-300 dark:border-gray-700"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-black dark:text-white mb-6">
              Turn Documents Into
              <br />
              <span className="text-black dark:text-white">
                Actionable Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Stop wasting hours reading documents. Upload, ask questions, get instant answers. 
              AI-powered document processing that actually understands what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <span>Start Processing</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#workflow"
                className="bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity border-2 border-black dark:border-white"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section - What Makes Us Different */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
              Why DocuFlow is Different
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We don't just extract text. We understand context, answer questions, and extract insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* USP 1 */}
            <div className="bg-white dark:bg-black rounded-xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                AI That Actually Understands
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Unlike basic OCR tools, DocuFlow uses advanced AI to understand context, relationships, 
                and meaning—not just extract text.
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Contextual understanding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Semantic search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Intelligent Q&A</span>
                </div>
              </div>
            </div>

            {/* USP 2 */}
            <div className="bg-white dark:bg-black rounded-xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                True Multilingual Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Process documents in 5+ languages seamlessly. Get summaries and answers in your 
                preferred language, not just English.
              </p>
              <div className="flex flex-wrap gap-2">
                {['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu'].map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-xs font-medium text-black dark:text-white">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* USP 3 */}
            <div className="bg-white dark:bg-black rounded-xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white dark:text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                Lightning Fast Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Built for speed with async processing, intelligent caching, and optimized architecture. 
                Get results in seconds, not minutes.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Processing Speed</span>
                  <span className="font-bold text-black dark:text-white">10x Faster</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section id="workflow" className="py-20 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
              How DocuFlow Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See the complete workflow from upload to insights
            </p>
          </div>

          {/* Visual Workflow Diagram */}
          <div className="relative">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="flex-1 mb-8 md:mb-0 md:mr-8">
                <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xl">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">Upload Document</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                      <Upload className="h-5 w-5 text-black dark:text-white" />
                      <span className="text-gray-700 dark:text-gray-300">Drag & drop or select file</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                      <FileText className="h-5 w-5 text-black dark:text-white" />
                      <span className="text-gray-700 dark:text-gray-300">Supports PDF, Images, Scans</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                      <Globe className="h-5 w-5 text-black dark:text-white" />
                      <span className="text-gray-700 dark:text-gray-300">Any language, any format</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <ArrowRightCircle className="h-12 w-12 text-black dark:text-white rotate-90 md:rotate-0" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="flex-1 mb-8 md:mb-0 md:ml-8 md:order-2">
                <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xl">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">AI Processing Pipeline</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                      <Cpu className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
                      <p className="text-sm font-medium text-black dark:text-white">OCR Extraction</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                      <Brain className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
                      <p className="text-sm font-medium text-black dark:text-white">AI Analysis</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                      <Database className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
                      <p className="text-sm font-medium text-black dark:text-white">Vector Embedding</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                      <Layers className="h-8 w-8 text-black dark:text-white mx-auto mb-2" />
                      <p className="text-sm font-medium text-black dark:text-white">Indexing</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white dark:bg-black rounded-lg border-2 border-black dark:border-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black dark:text-white">Processing Time</span>
                      <span className="text-lg font-bold text-black dark:text-white">~5-10 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 md:order-1">
                <ArrowRightCircle className="h-12 w-12 text-black dark:text-white rotate-90 md:rotate-180" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-8 md:mb-0 md:mr-8">
                <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xl">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-black dark:text-white">Get Instant Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageSquare className="h-5 w-5 text-black dark:text-white" />
                        <span className="font-semibold text-black dark:text-white">Ask Questions</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        "What's the deadline?" → Get instant answer from document
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="h-5 w-5 text-black dark:text-white" />
                        <span className="font-semibold text-black dark:text-white">AI Summary</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatic multilingual summary of key points
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="h-5 w-5 text-black dark:text-white" />
                        <span className="font-semibold text-black dark:text-white">Deadline Extraction</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically finds and highlights important dates
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center space-x-3 mb-2">
                        <Search className="h-5 w-5 text-black dark:text-white" />
                        <span className="font-semibold text-black dark:text-white">Semantic Search</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Find information by meaning, not just keywords
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
              Traditional vs. DocuFlow
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See the difference in how you work with documents
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Way */}
            <div className="bg-white dark:bg-black rounded-xl p-8 border-2 border-gray-300 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">❌ Traditional Way</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-black dark:text-white">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">Manually read entire document</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Takes 15-30 minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-black dark:text-white">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">Search for specific information</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Ctrl+F, read context, repeat</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-black dark:text-white">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">Extract deadlines manually</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Easy to miss important dates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-black dark:text-white">4</span>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">No multilingual support</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Stuck with one language</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm font-semibold text-black dark:text-white">Total Time: 30-60 minutes</p>
                </div>
              </div>
            </div>

            {/* DocuFlow Way */}
            <div className="bg-white dark:bg-black rounded-xl p-8 border-2 border-black dark:border-white">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">✅ DocuFlow Way</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">Upload document</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Takes 5 seconds</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">Ask questions, get instant answers</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">AI understands context</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">Automatic deadline extraction</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Never miss important dates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">Multilingual summaries & Q&A</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Works in 5+ languages</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-black dark:bg-white rounded-lg">
                  <p className="text-sm font-semibold text-white dark:text-black">Total Time: 10-30 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black dark:text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features built for modern document workflows
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Smart OCR', desc: 'Extract text from PDFs, images, and scanned documents with 99%+ accuracy' },
              { icon: Brain, title: 'AI Understanding', desc: 'Context-aware processing that understands meaning, not just text' },
              { icon: MessageSquare, title: 'Intelligent Q&A', desc: 'Ask questions in natural language, get precise answers instantly' },
              { icon: Globe, title: '5+ Languages', desc: 'Process and understand documents in multiple languages seamlessly' },
              { icon: Clock, title: 'Auto Deadlines', desc: 'Automatically extract and highlight important dates and deadlines' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Process documents in seconds with optimized async architecture' },
              { icon: Search, title: 'Semantic Search', desc: 'Find information by meaning, not just keyword matching' },
              { icon: Shield, title: 'Secure & Private', desc: 'Role-based access, encrypted storage, enterprise-grade security' },
              { icon: Database, title: 'Vector Search', desc: 'Advanced RAG pipeline with Pinecone for intelligent retrieval' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all">
                <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black dark:bg-white border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-black mb-6">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-700 mb-8">
            Join teams using DocuFlow to process documents 10x faster and get instant insights.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white dark:bg-black text-black dark:text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black dark:bg-white text-white dark:text-black py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6" />
              <span className="text-xl font-bold">DocuFlow</span>
            </div>
            <p className="text-sm opacity-70">
              © 2025 DocuFlow. AI Document Intelligence Platform. Built with FastAPI & Next.js.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
