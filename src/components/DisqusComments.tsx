'use client';

import React, { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { MessageSquare } from 'lucide-react';

interface DisqusProps {
  postUrl: string;
  postIdentifier: string;
  postTitle: string;
}

export function DisqusComments({ postUrl, postIdentifier, postTitle }: DisqusProps) {
  const [loaded, setLoaded] = useState(false);

  const loadDisqus = () => {
    if (loaded) return;
    setLoaded(true);

    (window as any).disqus_config = function () {
      this.page.url = postUrl;
      this.page.identifier = postIdentifier;
      this.page.title = postTitle;
    };

    const script = document.createElement('script');
    script.src = `https://${siteConfig.disqusShortname}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', String(+new Date()));
    (document.head || document.body).appendChild(script);
  };

  return (
    <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold font-mono text-[var(--neon-accent)] flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Discussion / Comments</span>
        </h3>

        {!loaded && (
          <button
            onClick={loadDisqus}
            className="px-4 py-2 rounded text-xs font-mono border border-[var(--neon-dim)] bg-[var(--bg-secondary)] text-[var(--neon-accent)] hover:border-[var(--neon-accent)] hover:bg-[var(--neon-accent)] hover:text-black transition-colors"
          >
            Load Comments
          </button>
        )}
      </div>

      <div id="disqus_thread" className="min-h-[120px]">
        {!loaded && (
          <div className="p-6 rounded border border-dashed border-[var(--border-color)] text-center text-sm font-mono text-[var(--text-muted)]">
            Click &ldquo;Load Comments&rdquo; to load the Disqus conversation thread.
          </div>
        )}
      </div>
    </div>
  );
}
