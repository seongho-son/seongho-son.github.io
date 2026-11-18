"""Capture fixed-size cards without locator scrolling/stability animation frames."""
from pathlib import Path
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError


def capture_cards(page, directory, count):
    page.add_style_tag(content='main{display:block!important;padding:0!important}.card{display:none!important}.card.capture-card{display:block!important}html,body{margin:0!important;overflow:hidden!important}')
    page.set_viewport_size({'width': 600, 'height': 750})
    staged = []
    try:
        for index in range(count):
            page.evaluate('''index => {
                const cards = [...document.querySelectorAll('.card')];
                cards.forEach((card,i) => card.classList.toggle('capture-card',i===index));
                window.scrollTo(0,0);
            }''', index)
            target = Path(directory) / f'{index+1:02}.pending.png'
            staged.append(target)
            for attempt in range(2):
                try:
                    page.screenshot(path=str(target), clip={'x':0,'y':0,'width':600,'height':750},
                                    animations='disabled', timeout=60000)
                    break
                except PlaywrightTimeoutError:
                    if attempt: raise
                    print(f'Retrying card {index+1}: screenshot timeout', flush=True)
        # Do not expose a partially regenerated set after a timeout.
        for index, target in enumerate(staged):
            target.replace(Path(directory) / f'{index+1:02}.png')
    finally:
        for target in staged:
            target.unlink(missing_ok=True)
