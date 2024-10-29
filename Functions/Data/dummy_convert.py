import re
from bs4 import BeautifulSoup

# Malformed HTML input
html_content = '''
strong>NEW YORKnge.</strongBrent crude was 61.The Organization of the Petroleum Exporting Cous.""Im
'''

def html_format_article(html_content):
    html_content = html_content.replace('strong>', '<strong>').replace('</strong', '</strong>')
    html_content = re.sub(r'""', '"', html_content)
    
    pattern = r'(<img[^>]*)(/)(?!>)'
    html_content = re.sub(pattern, r'\1\2>', html_content)
    
    soup = BeautifulSoup(html_content, 'html.parser')

    content_list = []

    for element in soup.descendants:
        if isinstance(element, str):
            text = element.strip()
            if text:
                content_list.append({'type': 'text', 'content': text})
        elif element.name == 'a':
            content_list.append({
                'type': 'anchor', 
                'link': element.get('href', ''), 
                'text': element.get_text(strip=True)
            })
        elif element.name == 'img':
            content_list.append({
                'type': 'image', 
                'src': element.get('src', ''), 
                'alt': element.get('alt', '')
            })

    for item in content_list:
        print(item)
    
    return content_list

def format_article(articles: list[dict]):
    new_content = ''
    for index, element in enumerate(articles):
        if element['type'] == 'text':
            new_content += text(element)
        elif element['type'] == 'image':
            new_content += image(element)
        elif element['type'] == 'anchor':
            new_content += anchor(element)
        if index < len(articles)-1: new_content += ','

    return '{"type":"doc","content":[CONTENT]}'.replace('CONTENT', new_content)

def text(text: str):
    return '{"type":"paragraph","content":[{"type":"text","text":"TEXT"}]}'.replace('TEXT', text['content'])

def image(image: dict):
    return '{"type":"image","attrs":{"src":"{src}" ,"alt":"{alt}" ,"title":"{alt}" ,"width":null,"height":null}}'.format(src=image['src'], alt=image['alt'])

def anchor(link: dict):
    return '{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"{a_link}","target":"_blank","rel":"noopener noreferrer nofollow","class":"text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"}}],"text":"{link_text}"}]}'.format(a_link=link['link'], link_text=link['text'])

article_list = html_format_article(html_content)
article_formatted_text = format_article(article_list)

print(article_formatted_text)