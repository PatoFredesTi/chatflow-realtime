import { Avatar, Button, Input, Loader } from './components/common';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          ChatFlow - Componentes Base
        </h1>

        {/* Avatars */}
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Avatars</h2>
          <div className="flex items-center gap-4">
            <Avatar alt="Usuario 1" size="sm" online />
            <Avatar alt="Usuario 2" size="md" online={false} />
            <Avatar alt="Usuario 3" size="lg" />
          </div>
        </section>

        {/* Buttons */}
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading>Loading</Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Inputs</h2>
          <div className="space-y-4 max-w-md">
            <Input label="Email" type="email" placeholder="tu@email.com" />
            <Input label="Contraseña" type="password" placeholder="••••••••" />
            <Input 
              label="Con error" 
              error="Este campo es requerido" 
              placeholder="Ingresa algo"
            />
          </div>
        </section>

        {/* Loader */}
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Loaders</h2>
          <div className="flex items-center gap-8">
            <Loader size="sm" />
            <Loader size="md" />
            <Loader size="lg" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;