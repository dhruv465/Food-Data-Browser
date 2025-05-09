/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  './pages/**/*.{js,jsx,ts,tsx}',
	  './components/**/*.{js,jsx,ts,tsx}',
	  './app/**/*.{js,jsx,ts,tsx}',
	  './src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  glass: {
			background: "var(--glass-background)",
			border: "var(--glass-border)",
			shadow: "var(--glass-shadow)",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		backdropBlur: {
		  xs: '2px',
		  sm: '4px',
		  md: 'var(--glass-blur)',
		  lg: '12px',
		  xl: '16px',
		},
		backgroundImage: {
		  'gradient-glass-1': 'var(--gradient-1)',
		  'gradient-glass-2': 'var(--gradient-2)',
		},
		boxShadow: {
		  glass: 'var(--glass-shadow)',
		},
	  },
	},
	plugins: [],
  }
  