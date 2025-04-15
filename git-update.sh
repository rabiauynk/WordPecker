#!/bin/bash

# Değişiklikleri kontrol et
echo "Değişiklikler kontrol ediliyor..."
git status

# Tüm değişiklikleri ekle
echo "Değişiklikler ekleniyor..."
git add .

# Commit mesajını sor
echo "Commit mesajını girin (örn: 'Navigasyon hatası düzeltildi'):"
read commit_message

# Eğer commit mesajı boşsa, varsayılan mesaj kullan
if [ -z "$commit_message" ]; then
  commit_message="Proje güncellendi"
fi

# Commit oluştur
echo "Commit oluşturuluyor: $commit_message"
git commit -m "$commit_message"

# Ana dalı kontrol et
branch=$(git branch --show-current)
echo "Mevcut dal: $branch"

# GitHub'a gönder
echo "Değişiklikler GitHub'a gönderiliyor..."
git push origin $branch

echo "Güncelleme tamamlandı!"
