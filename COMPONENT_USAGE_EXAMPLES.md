# 🧩 Component Usage Examples

## 🎛️ **Button Component**

```jsx
import Button from './components/UI/Button';

// Primary button (default)
<Button onClick={handleClick}>
  Primary Button
</Button>

// Different variants
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Outline</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With loading state
<Button loading={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>

// With icon
<Button>
  <svg className="w-4 h-4 mr-2">...</svg>
  Save Changes
</Button>
```

---

## 📝 **Input Component**

```jsx
import Input from './components/UI/Input';

// Basic input
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With icon
<Input
  label="Search"
  placeholder="Search..."
  icon={
    <svg className="w-5 h-5">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  }
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

---

## 🃏 **Card Component**

```jsx
import Card from './components/UI/Card';

// Basic card
<Card
  title="Basic Card"
  description="This is a basic card with title and description"
  onClick={() => console.log('Card clicked')}
/>

// Card with icon and badge
<Card
  title="Featured Course"
  description="Learn React with modern best practices"
  badge="New"
  icon={
    <svg className="w-6 h-6">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5..." />
    </svg>
  }
  onClick={handleCardClick}
/>

// Gradient card
<Card
  variant="gradient"
  gradient="from-purple-500 to-pink-600"
  title="Premium Feature"
  description="Unlock advanced features with premium"
  icon={<StarIcon />}
/>

// Glass morphism card
<Card
  variant="glass"
  title="Glass Card"
  description="Beautiful glass morphism effect"
/>

// Card with custom content
<Card title="Custom Content">
  <div className="space-y-4">
    <p>Custom content goes here</p>
    <Button size="sm">Action Button</Button>
  </div>
</Card>
```

---

## 🎨 **CSS Classes Usage**

```jsx
// Animations
<div className="animate-fade-in">Fade in animation</div>
<div className="animate-slide-up">Slide up animation</div>
<div className="animate-bounce-in">Bounce in animation</div>
<div className="animate-float">Floating animation</div>
<div className="animate-glow">Glowing effect</div>

// Glass morphism
<div className="glass p-6 rounded-xl">
  Glass morphism container
</div>

// Gradient text
<h1 className="gradient-text text-4xl font-bold">
  Gradient Text
</h1>

// Card hover effects
<div className="card-hover bg-white p-6 rounded-xl shadow-lg">
  Hover me for effects
</div>

// Focus ring
<button className="focus-ring px-4 py-2 rounded-lg">
  Accessible button
</button>
```

---

## 🌈 **Color Combinations**

```jsx
// Primary gradients
className="bg-gradient-to-r from-blue-500 to-purple-600"
className="bg-gradient-to-br from-blue-600 to-indigo-700"

// Success gradients
className="bg-gradient-to-r from-green-500 to-teal-600"
className="bg-gradient-to-br from-emerald-500 to-green-600"

// Warning gradients
className="bg-gradient-to-r from-orange-500 to-red-600"
className="bg-gradient-to-br from-yellow-500 to-orange-600"

// Info gradients
className="bg-gradient-to-r from-cyan-500 to-blue-600"
className="bg-gradient-to-br from-sky-500 to-indigo-600"
```

---

## 📱 **Responsive Examples**

```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => (
    <Card key={item.id} {...item} />
  ))}
</div>

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive Heading
</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## 🎯 **Best Practices**

1. **Consistent Spacing**: Use Tailwind's spacing scale (4, 6, 8, 12, 16, etc.)
2. **Color Harmony**: Stick to the defined color palette
3. **Animation Performance**: Use CSS transforms instead of changing layout properties
4. **Accessibility**: Always include focus states and proper contrast
5. **Mobile First**: Design for mobile, then enhance for desktop

---

## 🚀 **Performance Tips**

1. **Use CSS-only animations** when possible
2. **Avoid animating layout properties** (width, height, margin, padding)
3. **Prefer transform and opacity** for animations
4. **Use will-change** sparingly and remove after animation
5. **Optimize images** and use appropriate formats

---

## 🎨 **Customization**

```jsx
// Custom button variant
<Button 
  className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
  size="lg"
>
  Custom Styled Button
</Button>

// Custom card styling
<Card
  className="border-2 border-dashed border-gray-300 hover:border-blue-500"
  title="Custom Border Card"
/>

// Custom input styling
<Input
  className="border-purple-300 focus:border-purple-500 focus:ring-purple-200"
  label="Custom Input"
/>
```
