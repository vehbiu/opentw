const CUSTOM_STYLES = `
<style>
/* Tournament Theme */
:root {
  --background: #ffffff;
  --primary: #1e3a8a;  /* Deep navy */
  --text: #1f2937;
  --border: #cbd5e1;
  --hover-bg: #f8fafc;
  --match-bg: #ffffff;
  --match-highlight: #e2e8f0;
}

/* Base Layout */
body {
  margin: 0;
  padding: 16px;
  background-color: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  color: var(--text);
  line-height: 1.4;
}

/* Tournament Header */
tr.mainFrameHdr {
  background: var(--primary);
  color: white;
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  padding: 12px;
}

/* Match Entries */
.half-line, .full-line {
  background: none;
  padding: 0;
  margin: 0;
  border: none;
}

/* Remove hover effects */
.half-line:hover, .full-line:hover {
  background: none;
}

/* Bracket Lines */
td.t { border-top: 1px solid var(--border); }
td.r { border-right: 1px solid var(--border); }
td.b { border-bottom: 1px solid var(--border); }
td.l { border-left: 1px solid var(--border); }

td.tr { border-top: 1px solid var(--border); border-right: 1px solid var(--border); }
td.tb { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
td.tl { border-top: 1px solid var(--border); border-left: 1px solid var(--border); }
td.rb { border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
td.rl { border-right: 1px solid var(--border); border-left: 1px solid var(--border); }
td.bl { border-bottom: 1px solid var(--border); border-left: 1px solid var(--border); }
td.trbl { border: 1px solid var(--border); }
td.trl { border-top: 1px solid var(--border); border-right: 1px solid var(--border); border-left: 1px solid var(--border); }
td.trb { border-top: 1px solid var(--border); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
td.tbl { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); border-left: 1px solid var(--border); }
td.rbl { border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); border-left: 1px solid var(--border); }

/* Links */
a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a.plain {
  color: inherit;
}

/* Match Results */
td[valign="bottom"] {
  font-weight: 500;
}

/* Match Numbers */
a[href^="javascript:openBoutSheet"] {
  color: var(--text);
  font-size: 0.9em;
  opacity: 0.7;
}

/* Tournament Progress */
table.standard tr:nth-child(odd) {
  background-color: var(--background);
}

table.standard tr:nth-child(even) {
  background-color: var(--match-highlight);
}

/* Print Styles */
@media print {
  body {
    background: white;
  }
  
  tr.mainFrameHdr {
    background: white !important;
    color: black !important;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  body {
    padding: 8px;
  }
  
  tr.mainFrameHdr {
    font-size: 20px;
    padding: 10px;
  }
  
  .half-line, .full-line {
    padding: 4px 8px;
    font-size: 0.9em;
  }
}
</style>`;

export function BracketFrame({ frameInnerHtml }: Readonly<{ frameInnerHtml: string }>) {
    return (
        <iframe
            className="w-full h-full min-h-[600px]"
            srcDoc={frameInnerHtml + CUSTOM_STYLES}
            style={{ border: "none" }}
        />
    );
}