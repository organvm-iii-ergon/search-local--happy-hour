import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MenuItem, DrinkingTheme } from '@/lib/types';
import { Martini, CurrencyDollar, Sparkle, Star, Plus, X } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface MenuItemEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Omit<MenuItem, 'id' | 'createdAt'>) => void;
  bartenderId: string;
}

const CATEGORIES: { value: MenuItem['category']; label: string; icon: string }[] = [
  { value: 'cocktail', label: 'Cocktail', icon: '🍸' },
  { value: 'beer', label: 'Beer', icon: '🍺' },
  { value: 'wine', label: 'Wine', icon: '🍷' },
  { value: 'spirits', label: 'Spirits', icon: '🥃' },
  { value: 'mocktail', label: 'Mocktail', icon: '🧃' },
  { value: 'food', label: 'Food', icon: '🍽️' }
];

const DRINKING_THEMES: { value: DrinkingTheme; label: string }[] = [
  { value: 'famous-drunks', label: 'Famous Drunks' },
  { value: 'literary', label: 'Literary' },
  { value: 'archetypal', label: 'Archetypal' },
  { value: 'prohibition', label: 'Prohibition' },
  { value: 'ancient-rome', label: 'Ancient Rome' }
];

export function MenuItemEditor({
  open,
  onOpenChange,
  onSubmit,
  bartenderId
}: MenuItemEditorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MenuItem['category']>('cocktail');
  const [price, setPrice] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<DrinkingTheme | null>(null);
  const [isSignature, setIsSignature] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your menu item');
      return;
    }

    if (!description.trim() || description.length < 10) {
      toast.error('Please enter a description (min 10 characters)');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const menuItem: Omit<MenuItem, 'id' | 'createdAt'> = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      ingredients: ingredients.length > 0 ? ingredients : undefined,
      drinkingTheme: selectedTheme || undefined,
      isSignature,
      imageUrl: imageUrl.trim() || undefined,
      createdBy: bartenderId
    };

    onSubmit(menuItem);

    // Reset form
    setName('');
    setDescription('');
    setCategory('cocktail');
    setPrice('');
    setIngredients([]);
    setNewIngredient('');
    setSelectedTheme(null);
    setIsSignature(false);
    setImageUrl('');
    onOpenChange(false);

    toast.success('Menu item created!', {
      description: 'Your creation has been added to the menu'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Martini weight="fill" className="text-accent" />
            Create Menu Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Name and Price */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label className="text-sm font-bold mb-2 block">Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Hemingway Daiquiri, Caesar's Goblet..."
                className="glass-card"
                maxLength={100}
              />
            </div>
            <div>
              <Label className="text-sm font-bold mb-2 block flex items-center gap-2">
                <CurrencyDollar weight="fill" className="text-accent" />
                Price *
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="12.00"
                min="0"
                step="0.01"
                className="glass-card"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-bold mb-2 block">
              Description *
              <span className="text-muted-foreground font-normal ml-2">(minimum 10 characters)</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your creation, its flavor profile, inspiration..."
              className="min-h-[100px] glass-card resize-none"
              maxLength={300}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {description.length} / 300 characters
            </div>
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-bold mb-3 block">Category *</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <motion.button
                    key={cat.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat.value)}
                    className={`glass-morphic p-3 rounded-2xl text-sm font-semibold transition-all ${
                      isSelected
                        ? 'ring-2 ring-accent bg-accent/10'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs">{cat.label}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <Label className="text-sm font-bold mb-2 block">Ingredients (Optional)</Label>
            <div className="flex gap-2 mb-3">
              <Input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                placeholder="Add an ingredient..."
                className="glass-card flex-1"
              />
              <Button
                type="button"
                onClick={handleAddIngredient}
                variant="outline"
                size="sm"
                className="glass-morphic"
              >
                <Plus weight="bold" />
              </Button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-morphic px-3 py-1.5 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{ingredient}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Theme */}
          <div>
            <Label className="text-sm font-bold mb-3 block flex items-center gap-2">
              <Sparkle weight="fill" className="text-accent" />
              Drinking Theme (Optional)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTheme(null)}
                className={`glass-morphic p-3 rounded-2xl text-sm font-semibold transition-all ${
                  !selectedTheme
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-muted/50'
                }`}
              >
                None
              </motion.button>
              {DRINKING_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.value;
                return (
                  <motion.button
                    key={theme.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTheme(theme.value)}
                    className={`glass-morphic p-3 rounded-2xl text-sm font-semibold transition-all ${
                      isSelected
                        ? 'ring-2 ring-accent bg-accent/10'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    {theme.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Signature and Image */}
          <div className="space-y-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSignature(!isSignature)}
              className="glass-morphic p-4 rounded-2xl w-full text-left flex items-center gap-3"
            >
              <Checkbox checked={isSignature} />
              <div>
                <div className="font-bold flex items-center gap-2">
                  <Star weight={isSignature ? 'fill' : 'regular'} className="text-accent" />
                  Mark as Signature Item
                </div>
                <div className="text-sm text-muted-foreground">
                  Highlight this as one of your specialty creations
                </div>
              </div>
            </motion.button>

            <div>
              <Label className="text-sm font-bold mb-2 block">Image URL (Optional)</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="glass-card"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Martini className="w-4 h-4 mr-2" weight="fill" />
              Create Menu Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
