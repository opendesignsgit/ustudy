# 3D Carousel Center Mode - jQuery, HTML & CSS

A stunning 3D carousel component with center mode, built using jQuery, HTML, and CSS. Features smooth animations, responsive design, and interactive controls.

## Features

✨ **3D Transform Effects** - Items rotate and scale in 3D space with perspective  
🎯 **Center Mode** - The center item is highlighted and scaled larger for focus  
⚡ **jQuery Powered** - Smooth animations and interactions powered by jQuery  
🔄 **Auto-play** - Automatically cycles through items every 4 seconds  
🎮 **Navigation Controls** - Previous/Next buttons and dot indicators  
📱 **Responsive Design** - Adapts seamlessly to different screen sizes  
👆 **Click to Focus** - Click any visible item to bring it to center  
🌊 **Smooth Transitions** - Cubic-bezier easing for natural movement

## Demo

A live demo is available at `/carousel-demo` in the public directory. You can view it by opening `public/carousel-demo/index.html` in your browser.

### Screenshots

**Initial State:**
![3D Carousel Initial](https://github.com/user-attachments/assets/39780a86-bd25-4ca8-99c0-e829871f13e7)

**After Navigation:**
![3D Carousel After Click](https://github.com/user-attachments/assets/80aa90ba-39fc-4988-be8e-08d438bf1e44)

## Installation

1. Install jQuery:
```bash
npm install jquery @types/jquery
```

2. Import the Carousel3D component:
```tsx
import Carousel3D, { Carousel3DItem } from '@/components/Carousel3D'
```

## Usage

### React/Next.js Component

```tsx
import Carousel3D, { Carousel3DItem } from '@/components/Carousel3D'

const MyPage = () => {
  const items: Carousel3DItem[] = [
    {
      id: 1,
      image: '/path/to/image1.jpg',
      title: 'Item 1',
      description: 'Description for item 1',
    },
    {
      id: 2,
      image: '/path/to/image2.jpg',
      title: 'Item 2',
      description: 'Description for item 2',
    },
    // Add more items...
  ]

  return (
    <Carousel3D
      items={items}
      autoPlay={true}
      autoPlayInterval={4000}
      centerMode={true}
    />
  )
}
```

### Standalone HTML

For a pure HTML/CSS/jQuery implementation, see the demo at `public/carousel-demo/index.html`.

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Carousel3DItem[]` | Required | Array of carousel items |
| `autoPlay` | `boolean` | `true` | Enable/disable auto-play |
| `autoPlayInterval` | `number` | `4000` | Auto-play interval in milliseconds |
| `centerMode` | `boolean` | `true` | Enable/disable center mode |

## Carousel3DItem Interface

```typescript
interface Carousel3DItem {
  id: number
  image: string
  title: string
  description: string
}
```

## Customization

### CSS Variables

You can customize the carousel by modifying the CSS in `src/components/Carousel3D/carousel3d.css`:

- **Perspective**: Adjust the `perspective` value in `.carousel-3d-container`
- **Item dimensions**: Modify `width` and `height` in `.carousel-3d-item`
- **3D transforms**: Customize rotation and translation values in position classes
- **Transition timing**: Adjust `transition` duration and easing function
- **Colors**: Modify gradient colors and overlays

### Position Classes

The carousel uses position classes to arrange items in 3D space:
- `.center` - The centered, focused item
- `.left-1`, `.left-2`, `.left-3` - Items to the left of center
- `.right-1`, `.right-2`, `.right-3` - Items to the right of center

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Note: Requires CSS 3D transforms support.

## File Structure

```
src/components/Carousel3D/
├── Component.tsx        # React component with jQuery integration
├── carousel3d.css       # 3D carousel styles
└── index.ts            # Export file

public/carousel-demo/
├── index.html          # Standalone HTML demo
└── jquery.min.js       # jQuery library
```

## Technical Details

### 3D Transform Logic

The carousel uses CSS 3D transforms to create depth and perspective:
- `perspective: 1200px` on the container creates the 3D viewing space
- `transform-style: preserve-3d` maintains 3D positioning of child elements
- Individual items use `translateX`, `translateZ`, `rotateY`, and `scale` transforms
- Position is calculated based on distance from center

### jQuery Integration

jQuery is dynamically imported in the React component to:
- Handle smooth class transitions
- Manage click events and carousel rotation
- Update position classes based on current index
- Control auto-play timing

### Responsive Behavior

Media queries adjust the carousel for different screen sizes:
- **Desktop (>1024px)**: Full 7-item display with all positions visible
- **Tablet (768-1024px)**: 5-item display, outer items hidden
- **Mobile (<768px)**: 3-item display, focus on center with minimal side items

## Performance Considerations

- CSS transitions are hardware-accelerated using 3D transforms
- Images should be optimized for web (recommended: 600x800px)
- Auto-play can be disabled for better performance on low-end devices
- Lazy loading can be implemented for large image sets

## License

MIT License - Feel free to use in your projects!

## Credits

Created for the ustudy project as a demonstration of 3D carousel with center mode using jQuery, HTML, and CSS.
