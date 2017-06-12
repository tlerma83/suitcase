# Copyright 2015 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Cloud SDK markdown document markdown renderer (markdown in markdown out)."""

from googlecloudsdk.core.document_renderers import renderer


class MarkdownRenderer(renderer.Renderer):
  """Renders markdown to markdown."""

  def __init__(self, *args, **kwargs):
    super(MarkdownRenderer, self).__init__(*args, **kwargs)

  def Write(self, text):
    """Writes text to the markdown output.

    Args:
      text: The text to be written to the output.
    """
    self._out.write(text)
