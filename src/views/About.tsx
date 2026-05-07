import { motion } from 'motion/react';
import { Cpu, Users, Target, Rocket } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-3xl">
          <span className="text-[#00A650] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Our Origin</span>
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter text-[#141414] leading-[0.9] mb-12">
            Engineering <br /> The <span className="text-[#00A650]">Next.</span>
          </h1>
          <p className="text-2xl text-gray-500 leading-relaxed font-medium">
            At DigiTechLabs, we believe technology should be an invisible assistant—powerful, precise, and profoundly minimal.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-[#141414] py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-[#00A650] blur-[120px] opacity-20 -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000" 
              alt="Lab Engineering"
              className="w-[90%] lg:w-full h-auto rounded-[3rem] shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">The 1% Rule.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded by a collective of engineers and designers who were tired of bloated tech, DigiTechLabs was built on the principle of the "1% Rule": Every component, every line of code, and every millimeter of design must solve a genuine problem.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <span className="text-4xl font-bold text-[#00A650]">20+</span>
                <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest font-bold">Patented Designs</p>
              </div>
              <div>
                <span className="text-4xl font-bold text-[#00A650]">150k+</span>
                <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest font-bold">Happy Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold tracking-tight">Built on Core Values.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Target className="w-10 h-10" />, title: 'Absolute Precision', desc: 'We obsess over the details that others ignore, from haptic feedback to color calibration.' },
            { icon: <Cpu className="w-10 h-10" />, title: 'Future Proof', desc: 'Our devices are engineered to evolve with your ecosystem, not just survive the season.' },
            { icon: <Rocket className="w-10 h-10" />, title: 'Pure Human Logic', desc: 'If it doesnt make your life 10% simpler, we dont ship it. Zero friction, total clarity.' }
          ].map((v, i) => (
            <motion.div 
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-12 bg-white rounded-[3rem] border border-gray-100 hover:border-[#00650] hover:shadow-2xl hover:shadow-[#00A650]/5 transition-all group"
            >
              <div className="p-4 bg-[#F5F5F0] rounded-2xl text-[#141414] group-hover:bg-[#00A650] group-hover:text-white transition-all w-fit mb-8">
                {v.icon}
              </div>
              <h4 className="text-2xl font-bold mb-4">{v.title}</h4>
              <p className="text-gray-500 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
