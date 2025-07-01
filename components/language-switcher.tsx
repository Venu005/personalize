'use client';

import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage } from '@/store/slices/uiSlice';
import { languages } from '@/lib/i18n';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.ui.language);

  // Change language when the Redux store language changes
  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  // Handle language change
  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value));
    i18n.changeLanguage(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={t('settings.language')} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([code, { nativeName }]) => (
            <SelectItem key={code} value={code}>
              {nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}